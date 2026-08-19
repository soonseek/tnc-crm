import type {
  CompleteFirstContactInput,
  Deal,
  ServiceType,
} from "@tnc-crm/contracts";

export const DEAL_REPOSITORY = Symbol("DEAL_REPOSITORY");

export type CreateDealRecord = {
  deal: Deal;
  services: ServiceType[];
};

export type DealPage = {
  data: Deal[];
  nextCursor: string | null;
};

export interface DealRepository {
  readonly kind: "memory" | "postgres";
  health(): Promise<{ kind: DealRepository["kind"]; ready: boolean }>;
  listHolidayDates(): Promise<Set<string>>;
  create(record: CreateDealRecord, idempotencyKey: string): Promise<Deal>;
  list(cursor: string | undefined, limit: number): Promise<DealPage>;
  findById(id: string): Promise<Deal | null>;
  completeFirstContact(
    id: string,
    input: CompleteFirstContactInput,
    idempotencyKey: string,
  ): Promise<Deal | null>;
}

export function encodeCursor(deal: Deal) {
  return Buffer.from(JSON.stringify({ createdAt: deal.createdAt, id: deal.id })).toString(
    "base64url",
  );
}

export function decodeCursor(cursor: string | undefined) {
  if (!cursor) return null;
  try {
    const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      createdAt?: unknown;
      id?: unknown;
    };
    if (typeof value.createdAt !== "string" || typeof value.id !== "string") return null;
    return { createdAt: value.createdAt, id: value.id };
  } catch {
    return null;
  }
}
