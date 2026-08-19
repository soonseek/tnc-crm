import { randomUUID } from "node:crypto";

import type { CompleteFirstContactInput, Deal } from "@tnc-crm/contracts";

import {
  decodeCursor,
  encodeCursor,
  type CreateDealRecord,
  type DealPage,
  type DealRepository,
} from "./deal.repository";

export class InMemoryDealRepository implements DealRepository {
  readonly kind = "memory" as const;
  private readonly deals = new Map<string, Deal>();
  private readonly idempotency = new Map<string, Deal>();

  constructor(private readonly holidays = new Set<string>()) {}

  async health() {
    return { kind: this.kind, ready: true };
  }

  async listHolidayDates() {
    return new Set(this.holidays);
  }

  async create(record: CreateDealRecord, idempotencyKey: string) {
    const stored = this.idempotency.get(`create:${idempotencyKey}`);
    if (stored) return structuredClone(stored);

    if (record.deal.sourceId) {
      const duplicate = [...this.deals.values()].find(
        (deal) =>
          deal.sourceSystem === record.deal.sourceSystem &&
          deal.sourceId === record.deal.sourceId,
      );
      if (duplicate) return structuredClone(duplicate);
    }

    this.deals.set(record.deal.id, structuredClone(record.deal));
    this.idempotency.set(`create:${idempotencyKey}`, structuredClone(record.deal));
    return structuredClone(record.deal);
  }

  async list(cursor: string | undefined, limit: number): Promise<DealPage> {
    const decoded = decodeCursor(cursor);
    let values = [...this.deals.values()].sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id),
    );
    if (decoded) {
      values = values.filter(
        (deal) =>
          deal.createdAt < decoded.createdAt ||
          (deal.createdAt === decoded.createdAt && deal.id < decoded.id),
      );
    }
    const page = values.slice(0, limit);
    const hasNext = values.length > limit;
    return {
      data: structuredClone(page),
      nextCursor: hasNext && page.at(-1) ? encodeCursor(page.at(-1)!) : null,
    };
  }

  async findById(id: string) {
    const deal = this.deals.get(id);
    return deal ? structuredClone(deal) : null;
  }

  async completeFirstContact(
    id: string,
    input: CompleteFirstContactInput,
    idempotencyKey: string,
  ) {
    const stored = this.idempotency.get(`first-contact:${idempotencyKey}`);
    if (stored) return structuredClone(stored);

    const deal = this.deals.get(id);
    if (!deal) return null;
    const now = new Date().toISOString();
    const updated: Deal = {
      ...deal,
      stage: "discovery",
      status:
        input.outcome === "connected"
          ? "discovery_completed"
          : "customer_response_pending",
      validity: "valid",
      firstContactCompletedAt: new Date(input.occurredAt).toISOString(),
      nextActions: input.nextAction
        ? [
            ...deal.nextActions,
            {
              id: randomUUID(),
              type: input.nextAction.type,
              title: input.nextAction.title,
              dueAt: new Date(input.nextAction.dueAt).toISOString(),
              assigneeId: input.nextAction.assigneeId ?? input.actorId ?? null,
              note: input.nextAction.note ?? null,
              completedAt: null,
            },
          ]
        : deal.nextActions,
      updatedAt: now,
    };
    this.deals.set(id, updated);
    this.idempotency.set(`first-contact:${idempotencyKey}`, updated);
    return structuredClone(updated);
  }
}
