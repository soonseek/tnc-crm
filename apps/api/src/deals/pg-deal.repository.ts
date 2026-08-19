import type {
  CompanySize,
  CompleteFirstContactInput,
  Deal,
  DealStage,
  DealStatus,
  DealValidity,
  NextAction,
  ServiceType,
} from "@tnc-crm/contracts";
import type { OnApplicationShutdown } from "@nestjs/common";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

import {
  decodeCursor,
  encodeCursor,
  type CreateDealRecord,
  type DealPage,
  type DealRepository,
} from "./deal.repository";

type DealRow = QueryResultRow & {
  id: string;
  source_system: "manual" | "emergent";
  source_id: string | null;
  received_at: Date;
  company_id: string;
  company_name: string;
  company_size: CompanySize;
  contact_name: string;
  contact_title: string | null;
  phone: string;
  email: string;
  customer_note: string | null;
  owner_id: string | null;
  services: ServiceType[];
  stage: DealStage;
  status: DealStatus;
  validity: DealValidity;
  contact_deadline_at: Date;
  first_contact_completed_at: Date | null;
  next_actions: NextAction[];
  created_at: Date;
  updated_at: Date;
};

const DEAL_SELECT = `
  SELECT
    d.id, d.source_system, d.source_id, d.received_at,
    d.company_id, c.name AS company_name, c.size AS company_size,
    d.contact_name, d.contact_title, d.phone, d.email, d.customer_note,
    d.owner_id,
    COALESCE(
      (SELECT array_agg(ds.service_type ORDER BY ds.service_type) FROM deal_services ds WHERE ds.deal_id = d.id),
      ARRAY[]::text[]
    ) AS services,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', na.id::text,
            'type', na.action_type,
            'title', na.title,
            'dueAt', na.due_at,
            'assigneeId', na.assignee_id,
            'note', na.note,
            'completedAt', na.completed_at
          ) ORDER BY na.due_at, na.id
        )
        FROM next_actions na
        WHERE na.deal_id = d.id
      ),
      '[]'::jsonb
    ) AS next_actions,
    d.stage, d.status, d.validity, d.contact_deadline_at,
    d.first_contact_completed_at, d.created_at, d.updated_at
  FROM deals d
  JOIN companies c ON c.id = d.company_id
`;

function rowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    sourceSystem: row.source_system,
    sourceId: row.source_id,
    receivedAt: row.received_at.toISOString(),
    companyId: row.company_id,
    companyName: row.company_name,
    companySize: row.company_size,
    contactName: row.contact_name,
    contactTitle: row.contact_title,
    phone: row.phone,
    email: row.email,
    customerNote: row.customer_note,
    ownerId: row.owner_id,
    services: row.services,
    stage: row.stage,
    status: row.status,
    validity: row.validity,
    contactDeadlineAt: row.contact_deadline_at.toISOString(),
    firstContactCompletedAt: row.first_contact_completed_at?.toISOString() ?? null,
    nextActions: row.next_actions,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function lockIdempotency(client: PoolClient, scope: string, key: string) {
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`${scope}:${key}`]);
}

async function readIdempotentDeal(client: PoolClient, scope: string, key: string) {
  const result = await client.query<{ response_body: { data?: Deal } }>(
    "SELECT response_body FROM idempotency_records WHERE scope = $1 AND key = $2",
    [scope, key],
  );
  return result.rows[0]?.response_body.data ?? null;
}

async function saveIdempotentDeal(
  client: PoolClient,
  scope: string,
  key: string,
  deal: Deal,
) {
  await client.query(
    `INSERT INTO idempotency_records (scope, key, response_body)
     VALUES ($1, $2, $3::jsonb)`,
    [scope, key, JSON.stringify({ data: deal })],
  );
}

export class PgDealRepository implements DealRepository, OnApplicationShutdown {
  readonly kind = "postgres" as const;

  constructor(private readonly pool: Pool) {}

  async onApplicationShutdown() {
    await this.pool.end();
  }

  async health() {
    await this.pool.query("SELECT 1");
    return { kind: this.kind, ready: true };
  }

  async listHolidayDates() {
    const result = await this.pool.query<{ holiday_date: string }>(
      "SELECT holiday_date::text FROM calendar_holidays",
    );
    return new Set(result.rows.map((row) => row.holiday_date));
  }

  async create(record: CreateDealRecord, idempotencyKey: string) {
    const client = await this.pool.connect();
    const scope = "deals.create";
    try {
      await client.query("BEGIN");
      await lockIdempotency(client, scope, idempotencyKey);
      const replay = await readIdempotentDeal(client, scope, idempotencyKey);
      if (replay) {
        await client.query("COMMIT");
        return replay;
      }

      if (record.deal.sourceId) {
        const existing = await client.query<DealRow>(
          `${DEAL_SELECT} WHERE d.source_system = $1 AND d.source_id = $2`,
          [record.deal.sourceSystem, record.deal.sourceId],
        );
        const duplicate = existing.rows[0];
        if (duplicate) {
          const deal = rowToDeal(duplicate);
          await saveIdempotentDeal(client, scope, idempotencyKey, deal);
          await client.query("COMMIT");
          return deal;
        }
      }

      const normalizedCompanyName = record.deal.companyName.trim().toLocaleLowerCase("ko-KR");
      const company = await client.query<{ id: string }>(
        `INSERT INTO companies (id, name, normalized_name, size)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (normalized_name)
         DO UPDATE SET name = EXCLUDED.name, size = EXCLUDED.size, updated_at = now()
         RETURNING id`,
        [record.deal.companyId, record.deal.companyName, normalizedCompanyName, record.deal.companySize],
      );
      const companyId = company.rows[0]!.id;

      await client.query(
        `INSERT INTO deals (
          id, source_system, source_id, received_at, company_id,
          contact_name, contact_title, phone, email, customer_note, owner_id,
          stage, status, validity, contact_deadline_at,
          first_contact_completed_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18
        )`,
        [
          record.deal.id,
          record.deal.sourceSystem,
          record.deal.sourceId,
          record.deal.receivedAt,
          companyId,
          record.deal.contactName,
          record.deal.contactTitle,
          record.deal.phone,
          record.deal.email,
          record.deal.customerNote,
          record.deal.ownerId,
          record.deal.stage,
          record.deal.status,
          record.deal.validity,
          record.deal.contactDeadlineAt,
          record.deal.firstContactCompletedAt,
          record.deal.createdAt,
          record.deal.updatedAt,
        ],
      );

      for (const service of record.services) {
        await client.query(
          "INSERT INTO deal_services (deal_id, service_type) VALUES ($1, $2)",
          [record.deal.id, service],
        );
      }

      await client.query(
        `INSERT INTO audit_logs (entity_type, entity_id, action, after_value)
         VALUES ('deal', $1, 'created', $2::jsonb)`,
        [record.deal.id, JSON.stringify(record.deal)],
      );

      const createdResult = await client.query<DealRow>(
        `${DEAL_SELECT} WHERE d.id = $1`,
        [record.deal.id],
      );
      const created = rowToDeal(createdResult.rows[0]!);
      await saveIdempotentDeal(client, scope, idempotencyKey, created);
      await client.query("COMMIT");
      return created;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async list(cursor: string | undefined, limit: number): Promise<DealPage> {
    const decoded = decodeCursor(cursor);
    const result = decoded
      ? await this.pool.query<DealRow>(
          `${DEAL_SELECT}
           WHERE (d.created_at, d.id) < ($1::timestamptz, $2::uuid)
           ORDER BY d.created_at DESC, d.id DESC LIMIT $3`,
          [decoded.createdAt, decoded.id, limit + 1],
        )
      : await this.pool.query<DealRow>(
          `${DEAL_SELECT} ORDER BY d.created_at DESC, d.id DESC LIMIT $1`,
          [limit + 1],
        );
    const deals = result.rows.map(rowToDeal);
    const hasNext = deals.length > limit;
    const page = deals.slice(0, limit);
    return {
      data: page,
      nextCursor: hasNext && page.at(-1) ? encodeCursor(page.at(-1)!) : null,
    };
  }

  async findById(id: string) {
    const result = await this.pool.query<DealRow>(`${DEAL_SELECT} WHERE d.id = $1`, [id]);
    return result.rows[0] ? rowToDeal(result.rows[0]) : null;
  }

  async completeFirstContact(
    id: string,
    input: CompleteFirstContactInput,
    idempotencyKey: string,
  ) {
    const client = await this.pool.connect();
    const scope = `deals.first-contact.${id}`;
    try {
      await client.query("BEGIN");
      await lockIdempotency(client, scope, idempotencyKey);
      const replay = await readIdempotentDeal(client, scope, idempotencyKey);
      if (replay) {
        await client.query("COMMIT");
        return replay;
      }

      const beforeResult = await client.query<DealRow>(
        `${DEAL_SELECT} WHERE d.id = $1 FOR UPDATE OF d`,
        [id],
      );
      const beforeRow = beforeResult.rows[0];
      if (!beforeRow) {
        await client.query("ROLLBACK");
        return null;
      }
      const before = rowToDeal(beforeRow);
      const status: DealStatus =
        input.outcome === "connected"
          ? "discovery_completed"
          : "customer_response_pending";

      await client.query(
        `UPDATE deals SET
          stage = 'discovery', status = $2, validity = 'valid',
          first_contact_completed_at = $3, updated_at = now()
         WHERE id = $1`,
        [id, status, input.occurredAt],
      );
      await client.query(
        `INSERT INTO deal_activities
          (deal_id, activity_type, outcome, occurred_at, summary, actor_id)
         VALUES ($1, 'first_contact', $2, $3, $4, $5)`,
        [id, input.outcome, input.occurredAt, input.summary ?? null, input.actorId ?? null],
      );

      if (input.nextAction) {
        await client.query(
          `INSERT INTO next_actions
            (deal_id, action_type, title, due_at, assignee_id, note)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            id,
            input.nextAction.type,
            input.nextAction.title,
            input.nextAction.dueAt,
            input.nextAction.assigneeId ?? input.actorId ?? null,
            input.nextAction.note ?? null,
          ],
        );
      }

      const afterResult = await client.query<DealRow>(`${DEAL_SELECT} WHERE d.id = $1`, [id]);
      const after = rowToDeal(afterResult.rows[0]!);
      await client.query(
        `INSERT INTO audit_logs
          (entity_type, entity_id, action, actor_id, before_value, after_value)
         VALUES ('deal', $1, 'first_contact_completed', $2, $3::jsonb, $4::jsonb)`,
        [id, input.actorId ?? null, JSON.stringify(before), JSON.stringify(after)],
      );
      await saveIdempotentDeal(client, scope, idempotencyKey, after);
      await client.query("COMMIT");
      return after;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
