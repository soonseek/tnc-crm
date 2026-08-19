"use client";

import type { CompanySize, CreateDealInput, Deal, ServiceType } from "@tnc-crm/contracts";
import { AlertCircle, Check, CircleCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeal } from "@/lib/crm-api";
import { cn } from "@/lib/utils";

const services = [
  { label: "집합교육", value: "group_training" },
  { label: "온라인 1:1 코칭", value: "online_coaching" },
  { label: "AX 구축 서비스", value: "ax_build" },
  { label: "3개월 변화관리", value: "change_management" },
] satisfies { label: string; value: ServiceType }[];

const companySizes = [
  { label: "1~10명", value: "1_10" },
  { label: "11~50명", value: "11_50" },
  { label: "51~200명", value: "51_200" },
  { label: "201~500명", value: "201_500" },
  { label: "500명 이상", value: "500_plus" },
] satisfies { label: string; value: CompanySize }[];

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; deal: Deal }
  | { status: "error"; message: string };

export function NewDealForm() {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  function toggleService(service: ServiceType) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  async function submitDeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: CreateDealInput = {
      source: { system: "manual" },
      receivedAt: new Date().toISOString(),
      companyName: String(form.get("companyName") ?? ""),
      companySize: String(form.get("companySize") ?? "") as CompanySize,
      contactName: String(form.get("contactName") ?? ""),
      contactTitle: String(form.get("contactTitle") ?? "") || undefined,
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      customerNote: String(form.get("customerNote") ?? "") || undefined,
      services: selectedServices,
    };

    setSubmission({ status: "submitting" });
    try {
      const deal = await createDeal(input, idempotencyKey.current);
      setSubmission({ status: "success", deal });
      idempotencyKey.current = crypto.randomUUID();
    } catch (error) {
      setSubmission({
        status: "error",
        message: error instanceof Error ? error.message : "영업 건을 등록하지 못했습니다.",
      });
    }
  }

  return (
    <form className="space-y-5" onSubmit={submitDeal}>
      <Card>
        <CardHeader>
          <CardTitle>회사·담당자</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="회사명" required>
            <Input name="companyName" placeholder="예: 한빛모빌리티" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="담당자명" required>
              <Input name="contactName" placeholder="예: 박서준" required />
            </Field>
            <Field label="직함">
              <Input name="contactTitle" placeholder="인재개발팀장" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="연락처" required>
              <Input name="phone" type="tel" inputMode="tel" placeholder="010-0000-0000" required />
            </Field>
            <Field label="이메일" required>
              <Input name="email" type="email" inputMode="email" placeholder="name@company.com" required />
            </Field>
          </div>
          <Field label="회사 규모" required>
            <select name="companySize" defaultValue="" required className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <option value="" disabled>회사 규모 선택</option>
              {companySizes.map((size) => <option key={size.value} value={size.value}>{size.label}</option>)}
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>문의 내용</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="관심 서비스">
            <div className="flex flex-wrap gap-2">
              {services.map((service) => {
                const selected = selectedServices.includes(service.value);
                return (
                  <button
                    key={service.value}
                    type="button"
                    aria-label={service.label}
                    onClick={() => toggleService(service.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium",
                      selected && "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {selected ? <Check className="size-3.5" /> : null}
                    {service.label}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="문의 메모">
            <Textarea name="customerNote" placeholder="전화나 소개로 전달받은 배경을 기록하세요." />
          </Field>
          <Field label="기본 담당자">
            <div className="flex items-center justify-between rounded-lg border px-3 py-3">
              <div>
                <p className="text-sm font-medium">김정석</p>
                <p className="mt-0.5 text-xs text-muted-foreground">기본 담당자 자동 지정</p>
              </div>
              <Badge variant="secondary">관리자</Badge>
            </div>
          </Field>
        </CardContent>
      </Card>

      {submission.status === "success" ? (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">영업 건이 등록됐습니다.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  첫 연락 기한 · {new Date(submission.deal.contactDeadlineAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/deals/${submission.deal.id}`}>등록한 영업 건 보기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {submission.status === "error" ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{submission.message}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" disabled title="추가 구축 범위">
          임시 저장 준비 중
        </Button>
        <Button type="submit" disabled={submission.status === "submitting"}>
          {submission.status === "submitting" ? <Loader2 className="animate-spin" /> : null}
          {submission.status === "submitting" ? "등록 중" : "영업 건 등록"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
    </label>
  );
}
