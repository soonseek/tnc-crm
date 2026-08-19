"use client";

import type { CompleteFirstContactInput } from "@tnc-crm/contracts";
import { AlertCircle, Check, CircleCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { FrameField } from "@/components/frame-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { completeFirstContact } from "@/lib/crm-api";

function localDateTimeValue(hoursToAdd = 0) {
  const date = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function FirstContactForm({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [includeNextAction, setIncludeNextAction] = useState(true);
  const [outcome, setOutcome] = useState<CompleteFirstContactInput["outcome"]>("connected");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const idempotencyKey = useRef(crypto.randomUUID());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: CompleteFirstContactInput = {
      outcome,
      occurredAt: new Date(String(form.get("occurredAt"))).toISOString(),
      summary: String(form.get("summary") ?? "") || undefined,
      nextAction: includeNextAction
        ? {
            type: String(form.get("nextActionType")) as NonNullable<CompleteFirstContactInput["nextAction"]>["type"],
            title: String(form.get("nextActionTitle") ?? ""),
            dueAt: new Date(String(form.get("nextActionDueAt"))).toISOString(),
          }
        : undefined,
    };

    setState("submitting");
    try {
      await completeFirstContact(dealId, input, idempotencyKey.current);
      setState("success");
      router.refresh();
      idempotencyKey.current = crypto.randomUUID();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "첫 연락 결과를 저장하지 못했습니다.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <Card className="border-primary/25 bg-primary/5">
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">첫 연락이 완료됐습니다.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                상태가 `초기 상담 · {outcome === "connected" ? "초기 상담 완료" : "고객 응답 대기"}`로 변경됐습니다.
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href={`/deals/${dealId}`}>영업 건으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <Card>
        <CardHeader><CardTitle>첫 연락 결과</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FrameField label="완료 조건" required>
            <select
              name="outcome"
              value={outcome}
              onChange={(event) => setOutcome(event.target.value as CompleteFirstContactInput["outcome"])}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs"
            >
              <option value="connected">고객과 통화함</option>
              <option value="message_left">통화 실패 후 문자를 남김</option>
            </select>
          </FrameField>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-medium text-muted-foreground">저장 후 상태</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>초기 상담</Badge>
              <Badge variant="secondary">
                {outcome === "connected" ? "초기 상담 완료" : "고객 응답 대기"}
              </Badge>
            </div>
          </div>
          <FrameField label="연락 시각" required>
            <Input name="occurredAt" type="datetime-local" defaultValue={localDateTimeValue()} required />
          </FrameField>
          <FrameField label="상담·발송 내용">
            <Textarea name="summary" placeholder="확인한 배경이나 남긴 문자 내용을 기록하세요." />
          </FrameField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>다음 행동</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setIncludeNextAction((current) => !current)}>
              {includeNextAction ? "등록함" : "등록 안 함"}
            </Button>
          </div>
        </CardHeader>
        {includeNextAction ? (
          <CardContent className="space-y-4">
            <FrameField label="행동 유형" required>
              <select name="nextActionType" defaultValue="call" className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs">
                <option value="call">전화</option>
                <option value="meeting">대면·화상 미팅</option>
                <option value="send_profile">회사소개서 발송</option>
                <option value="send_sample_quote">샘플 견적 발송</option>
                <option value="send_proposal">제안 대응</option>
                <option value="schedule_seminar">세미나 일정</option>
                <option value="other">기타</option>
              </select>
            </FrameField>
            <FrameField label="행동 제목" required>
              <Input name="nextActionTitle" defaultValue="고객 응답 확인" required />
            </FrameField>
            <FrameField label="실행 기한" required>
              <Input name="nextActionDueAt" type="datetime-local" defaultValue={localDateTimeValue(24)} required />
            </FrameField>
          </CardContent>
        ) : null}
      </Card>

      {state === "error" ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={state === "submitting"}>
        {state === "submitting" ? <Loader2 className="animate-spin" /> : <Check />}
        {state === "submitting" ? "저장 중" : "첫 연락 완료 저장"}
      </Button>
    </form>
  );
}
