import {
  type CompleteFirstContactInput,
  dealSchema,
  type CreateDealInput,
  type Deal,
} from "@tnc-crm/contracts";

function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return (
      process.env.CRM_API_BASE_URL ??
      process.env.NEXT_PUBLIC_CRM_API_BASE_URL ??
      "http://localhost:3002/api/v1"
    );
  }
  return process.env.NEXT_PUBLIC_CRM_API_BASE_URL ?? "http://localhost:3002/api/v1";
}

async function readJson(response: Response) {
  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : `CRM API 요청에 실패했습니다. (${response.status})`;
    throw new Error(message);
  }
  return payload;
}

export async function createDeal(input: CreateDealInput, idempotencyKey: string) {
  const response = await fetch(`${getApiBaseUrl()}/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });
  const payload = (await readJson(response)) as { data?: unknown };
  return dealSchema.parse(payload.data);
}

export async function getDeal(id: string): Promise<Deal | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/deals/${id}`, {
      cache: "no-store",
    });
    if (response.status === 404) return null;
    const payload = (await readJson(response)) as { data?: unknown };
    return dealSchema.parse(payload.data);
  } catch {
    return null;
  }
}

export async function completeFirstContact(
  id: string,
  input: CompleteFirstContactInput,
  idempotencyKey: string,
) {
  const response = await fetch(`${getApiBaseUrl()}/deals/${id}/first-contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });
  const payload = (await readJson(response)) as { data?: unknown };
  return dealSchema.parse(payload.data);
}
