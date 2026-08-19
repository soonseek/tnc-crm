import assert from "node:assert/strict";
import test from "node:test";

import { calculateFirstContactDeadline } from "./business-calendar";

test("업무시간 내 금요일 문의는 월요일 같은 시각까지 연락한다", () => {
  const deadline = calculateFirstContactDeadline(new Date("2026-08-21T15:00:00+09:00"));
  assert.equal(deadline.toISOString(), "2026-08-24T06:00:00.000Z");
});

test("다음 날이 공휴일이면 그 다음 업무일까지 미룬다", () => {
  const deadline = calculateFirstContactDeadline(
    new Date("2026-08-17T16:00:00+09:00"),
    new Set(["2026-08-18"]),
  );
  assert.equal(deadline.toISOString(), "2026-08-19T07:00:00.000Z");
});

test("업무시간 외 문의는 다음 업무일 오후 6시까지 연락한다", () => {
  const deadline = calculateFirstContactDeadline(new Date("2026-08-21T19:20:00+09:00"));
  assert.equal(deadline.toISOString(), "2026-08-24T09:00:00.000Z");
});

test("주말 문의는 다음 업무일 오후 6시까지 연락한다", () => {
  const deadline = calculateFirstContactDeadline(new Date("2026-08-22T11:00:00+09:00"));
  assert.equal(deadline.toISOString(), "2026-08-24T09:00:00.000Z");
});
