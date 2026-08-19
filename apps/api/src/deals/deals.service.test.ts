import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryDealRepository } from "./in-memory-deal.repository";
import { DealsService } from "./deals.service";

const createInput = {
  source: { system: "emergent" as const, id: "EM-TEST-1" },
  receivedAt: "2026-08-17T16:00:00+09:00",
  companyName: "테스트기업",
  companySize: "51_200" as const,
  contactName: "홍길동",
  contactTitle: "인사팀장",
  phone: "010-1234-5678",
  email: "hr@example.com",
  customerNote: "AX 집합교육 문의",
  services: ["group_training" as const],
};

test("신규 문의는 공휴일을 반영한 첫 연락 기한과 함께 등록된다", async () => {
  const service = new DealsService(new InMemoryDealRepository(new Set(["2026-08-18"])));
  const result = await service.create(createInput, "create-test-1");

  assert.equal(result.data.stage, "new");
  assert.equal(result.data.status, "unreviewed");
  assert.equal(result.data.contactDeadlineAt, "2026-08-19T07:00:00.000Z");
});

test("같은 중복 방지키는 같은 영업 건을 반환한다", async () => {
  const service = new DealsService(new InMemoryDealRepository());
  const first = await service.create(createInput, "create-test-2");
  const replay = await service.create(createInput, "create-test-2");

  assert.equal(replay.data.id, first.data.id);
});

test("문자를 남기면 첫 연락 완료와 고객 응답 대기로 전환된다", async () => {
  const service = new DealsService(new InMemoryDealRepository());
  const created = await service.create(createInput, "create-test-3");
  const completed = await service.completeFirstContact(
    created.data.id,
    {
      outcome: "message_left",
      occurredAt: "2026-08-17T17:00:00+09:00",
      summary: "통화 실패 후 문자 발송",
      nextAction: {
        type: "call",
        title: "고객 응답 확인",
        dueAt: "2026-08-18T09:00:00+09:00",
      },
    },
    "contact-test-3",
  );

  assert.equal(completed.data.stage, "discovery");
  assert.equal(completed.data.status, "customer_response_pending");
  assert.equal(completed.data.validity, "valid");
  assert.equal(completed.data.firstContactCompletedAt, "2026-08-17T08:00:00.000Z");
  assert.equal(completed.data.nextActions[0]?.title, "고객 응답 확인");
});

test("고객과 통화하면 초기 상담 완료로 전환된다", async () => {
  const service = new DealsService(new InMemoryDealRepository());
  const created = await service.create(
    { ...createInput, source: { system: "emergent", id: "EM-TEST-CONNECTED" } },
    "create-test-connected",
  );
  const completed = await service.completeFirstContact(
    created.data.id,
    {
      outcome: "connected",
      occurredAt: "2026-08-17T17:00:00+09:00",
    },
    "contact-test-connected",
  );

  assert.equal(completed.data.stage, "discovery");
  assert.equal(completed.data.status, "discovery_completed");
});
