import { randomUUID } from "node:crypto";

import {
  completeFirstContactSchema,
  createDealSchema,
  dealListSchema,
  dealSchema,
  type CompleteFirstContactInput,
  type CreateDealInput,
  type Deal,
} from "@tnc-crm/contracts";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { calculateFirstContactDeadline } from "../domain/business-calendar";
import { DEAL_REPOSITORY, type DealRepository } from "./deal.repository";

@Injectable()
export class DealsService {
  constructor(
    @Inject(DEAL_REPOSITORY) private readonly repository: DealRepository,
  ) {}

  health() {
    return this.repository.health();
  }

  async create(rawInput: unknown, idempotencyKey: string) {
    const parsed = createDealSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "신규 영업 건 입력값이 올바르지 않습니다.",
        issues: parsed.error.issues,
      });
    }
    const input = parsed.data as CreateDealInput;
    if (input.source.system === "emergent" && !input.source.id) {
      throw new BadRequestException("Emergent 문의에는 원본 ID가 필요합니다.");
    }

    const holidays = await this.repository.listHolidayDates();
    const now = new Date().toISOString();
    const deal: Deal = {
      id: randomUUID(),
      sourceSystem: input.source.system,
      sourceId: input.source.id ?? null,
      receivedAt: new Date(input.receivedAt).toISOString(),
      companyId: randomUUID(),
      companyName: input.companyName,
      companySize: input.companySize,
      contactName: input.contactName,
      contactTitle: input.contactTitle ?? null,
      phone: input.phone,
      email: input.email,
      customerNote: input.customerNote ?? null,
      ownerId: input.ownerId ?? null,
      services: input.services,
      stage: "new",
      status: "unreviewed",
      validity: "pending",
      contactDeadlineAt: calculateFirstContactDeadline(
        new Date(input.receivedAt),
        holidays,
      ).toISOString(),
      firstContactCompletedAt: null,
      nextActions: [],
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.repository.create(
      { deal: dealSchema.parse(deal), services: input.services },
      idempotencyKey,
    );
    return { data: dealSchema.parse(created) };
  }

  async list(cursor: string | undefined, requestedLimit: number | undefined) {
    const limit = Math.min(Math.max(requestedLimit ?? 20, 1), 100);
    const page = await this.repository.list(cursor, limit);
    return dealListSchema.parse({
      data: page.data,
      meta: { nextCursor: page.nextCursor },
    });
  }

  async findById(id: string) {
    const deal = await this.repository.findById(id);
    if (!deal) throw new NotFoundException("영업 건을 찾을 수 없습니다.");
    return { data: dealSchema.parse(deal) };
  }

  async completeFirstContact(
    id: string,
    rawInput: unknown,
    idempotencyKey: string,
  ) {
    const parsed = completeFirstContactSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "첫 연락 완료 입력값이 올바르지 않습니다.",
        issues: parsed.error.issues,
      });
    }
    const input = parsed.data as CompleteFirstContactInput;
    const deal = await this.repository.completeFirstContact(id, input, idempotencyKey);
    if (!deal) throw new NotFoundException("영업 건을 찾을 수 없습니다.");
    return { data: dealSchema.parse(deal) };
  }
}
