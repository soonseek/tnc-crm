import type { Deal as ApiDeal, NextActionType } from "@tnc-crm/contracts";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  Mail,
  MessageSquareText,
  Phone,
  UserRoundCog,
} from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDeal } from "@/lib/crm-api";
import { deals } from "@/lib/mock-data";

const stageLabels = {
  new: "신규",
  discovery: "초기 상담",
  follow_up: "후속 진행",
  proposal: "제안·협의",
  contract: "계약",
  on_hold: "보류",
  closed: "종료",
} as const;

const statusLabels = {
  unreviewed: "미확인",
  first_contact_pending: "1차 연락 대기",
  customer_response_pending: "고객 응답 대기",
  discovery_completed: "초기 상담 완료",
  meeting_scheduled: "미팅 일정 확정",
  meeting_completed: "미팅 완료",
  company_profile_sent: "회사소개서 발송 완료",
  sample_quote_sent: "샘플 견적 발송 완료",
  proposal_response_completed: "제안 대응 완료",
  seminar_scheduled: "세미나 일정 확정",
  formal_proposal_sent: "정식 제안·견적 발송 완료",
  negotiating: "협의 중",
  contract_sent: "계약서 송부",
  contract_signed: "계약서 서명 완료",
  invoice_issued: "계산서 발행",
  long_term_hold: "장기 보류",
  lost: "계약 실패",
  excluded: "상담 대상 제외",
} as const;

const serviceLabels = {
  group_training: "집합교육",
  online_coaching: "온라인 1:1 코칭",
  ax_build: "AX 구축 서비스",
  change_management: "3개월 변화관리",
} as const;

const nextActionTypeLabels: Record<NextActionType, string> = {
  call: "전화",
  message: "문자",
  meeting: "대면·화상 미팅",
  send_profile: "회사소개서 발송",
  send_sample_quote: "샘플 견적 발송",
  send_proposal: "제안 대응",
  schedule_seminar: "세미나 일정",
  other: "기타",
};

function hasPassed(deadlineAt: string) {
  return new Date(deadlineAt).getTime() < Date.now();
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mockDeal = deals.find((item) => item.id === id);
  const apiDeal = /^[0-9a-f-]{36}$/i.test(id) ? await getDeal(id) : null;

  const deal = apiDeal
    ? {
        id: apiDeal.id,
        company: apiDeal.companyName,
        contact: [apiDeal.contactName, apiDeal.contactTitle].filter(Boolean).join(" "),
        initialRequest: apiDeal.customerNote || "초기 요청 메모 없음",
        status: statusLabels[apiDeal.status],
        stage: stageLabels[apiDeal.stage],
        service:
          apiDeal.services.map((service) => serviceLabels[service]).join(" · ") || "서비스 미지정",
        due: new Date(apiDeal.contactDeadlineAt).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        value: "미입력",
        probability: apiDeal.stage === "discovery" ? 5 : 0,
        urgent:
          !apiDeal.firstContactCompletedAt &&
          hasPassed(apiDeal.contactDeadlineAt),
        delegated: false,
        phone: apiDeal.phone,
        email: apiDeal.email,
        customerNote: apiDeal.customerNote || "고객 메모 없음",
      }
    : mockDeal
      ? {
          ...mockDeal,
          phone: "010-1234-5678",
          email: "hr@sample-company.co.kr",
          customerNote: "사내 리더의 업무 노하우를 교육 자료로 전환하는 과정과 이후 변화관리 방안을 문의했습니다.",
        }
      : null;

  if (!deal) {
    notFound();
  }

  return (
    <>
      <ScreenHeader title={deal.company} description={deal.contact} backHref="/" />
      <div className="space-y-6 px-4 py-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{deal.stage}</Badge>
              <Badge variant="secondary">{deal.status}</Badge>
              {deal.delegated ? <Badge variant="outline">대표님 위임</Badge> : null}
            </div>
            <CardTitle className="pt-2 text-xl">{deal.company}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {deal.service} · 추산 {deal.value} · 성공 확률 {deal.probability}%
            </p>
            <p className="pt-2 text-sm leading-6">
              <span className="text-muted-foreground">초기 요청 · </span>
              {deal.initialRequest}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border px-3 py-3">
              <div>
                <p className="text-xs text-muted-foreground">현재 기한</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Clock3 className="size-4" /> {deal.due}
                </p>
              </div>
              <Badge variant={deal.urgent ? "destructive" : "outline"}>
                {deal.urgent ? "우선 처리" : "진행 중"}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button asChild variant="outline" className="h-auto flex-col py-3 text-xs">
                <a href={`tel:${deal.phone.replaceAll("-", "")}`}>
                  <Phone className="size-5" /> 전화
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col py-3 text-xs">
                <a href={`sms:${deal.phone.replaceAll("-", "")}`}>
                  <MessageSquareText className="size-5" /> 문자
                </a>
              </Button>
              {apiDeal?.firstContactCompletedAt ? (
                <div className="flex h-auto flex-col items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary/5 py-3 text-xs font-medium text-primary">
                  <Check className="size-5" /> 연락 완료
                </div>
              ) : (
                <Button asChild variant="outline" className="h-auto flex-col py-3 text-xs">
                  <Link href={`/deals/${deal.id}/activity`}><Check className="size-5" /> 연락 기록</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-auto flex-col py-3 text-xs">
                <Link href={`/deals/${deal.id}/delegate`}><UserRoundCog className="size-5" /> 위임</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <SectionHeading title="고객 정보" />
          <Card className="gap-0 py-0">
            <CardContent className="divide-y px-0 text-sm">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Phone className="size-4 text-muted-foreground" />
                <span className="flex-1">{deal.phone}</span>
                <Button asChild variant="ghost" size="sm">
                  <a href={`tel:${deal.phone.replaceAll("-", "")}`}>전화</a>
                </Button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Mail className="size-4 text-muted-foreground" />
                <span className="flex-1">{deal.email}</span>
              </div>
              <div className="px-4 py-3.5">
                <p className="text-xs text-muted-foreground">고객 메모</p>
                <p className="mt-2 leading-6">{deal.customerNote}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {apiDeal ? (
          <LiveNextActions deal={apiDeal} formattedFirstContactDeadline={deal.due} />
        ) : <section className="space-y-3">
          <SectionHeading title="다음 행동" count={2} actionHref={`/deals/${deal.id}/next-action`} actionLabel="추가" />
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
                  <CalendarDays className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">배경 확인 전화</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    담당 김정석 · {deal.due}
                  </p>
                </div>
                <Button size="sm">완료</Button>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">회사소개서 발송</p>
                  <p className="mt-1 text-xs text-muted-foreground">담당 김정석 · 8월 21일</p>
                </div>
                <Button variant="outline" size="sm">
                  수정
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                다음 행동 추가
              </Button>
            </CardContent>
          </Card>
        </section>}

        <section className="space-y-3">
          <SectionHeading title="활동 이력" actionHref={`/deals/${deal.id}/history`} actionLabel="전체" />
          <Card>
            <CardContent>
              <div className="relative space-y-5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border">
                {[
                  ["상담 접수", "8월 19일 오전 11:40 · Emergent"],
                  ["담당자 자동 지정", "8월 19일 오전 11:40 · 시스템"],
                  ["텔레그램 알림 수신", "8월 19일 오전 11:40"],
                ].map(([title, meta]) => (
                  <div key={title} className="relative flex gap-3">
                    <span className="z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-background bg-foreground" />
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeading title="문서·계약" actionHref={`/deals/${deal.id}/documents`} actionLabel="관리" />
          <Card className="gap-0 py-0">
            <CardContent className="divide-y px-0">
              {["회사소개서", "샘플 견적서", "계약서"].map((document) => (
                <div key={document} className="flex items-center gap-3 px-4 py-3.5">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-sm font-medium">{document}</span>
                  <Button variant="ghost" size="icon-sm" aria-label={`${document} 열기`}>
                    <ExternalLink />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeading title="영업 정보 관리" />
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline"><Link href={`/deals/${deal.id}/edit`}>정보 수정</Link></Button>
            <Button asChild variant="outline"><Link href={`/deals/${deal.id}/status`}>상태 변경</Link></Button>
            <Button asChild variant="outline"><Link href={`/deals/${deal.id}/services`}>서비스·추산</Link></Button>
            <Button asChild variant="outline"><Link href={`/deals/${deal.id}/history`}>변경 이력</Link></Button>
          </div>
        </section>

        <Button asChild variant="outline" className="w-full">
          <Link href="/contracts/dawon-group">계약·청구 정보 보기</Link>
        </Button>
      </div>
    </>
  );
}

function LiveNextActions({
  deal,
  formattedFirstContactDeadline,
}: {
  deal: ApiDeal;
  formattedFirstContactDeadline: string;
}) {
  const needsFirstContact = !deal.firstContactCompletedAt;
  const nextActions = deal.nextActions ?? [];
  const count = nextActions.length + (needsFirstContact ? 1 : 0);

  return (
    <section className="space-y-3">
      <SectionHeading title="다음 행동" count={count} />
      <Card>
        <CardContent className="space-y-4">
          {needsFirstContact ? (
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                <Phone className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">배경 확인 전화</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  첫 연락 기한 · {formattedFirstContactDeadline}
                </p>
              </div>
              <Button asChild size="sm">
                <Link href={`/deals/${deal.id}/activity`}>첫 연락 기록</Link>
              </Button>
            </div>
          ) : null}

          {needsFirstContact && nextActions.length > 0 ? <Separator /> : null}

          {nextActions.map((action, index) => (
            <div key={action.id}>
              {index > 0 ? <Separator className="mb-4" /> : null}
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <CalendarDays className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{action.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {nextActionTypeLabels[action.type]} · {new Date(action.dueAt).toLocaleString("ko-KR", {
                      timeZone: "Asia/Seoul",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge variant="outline">예정</Badge>
              </div>
            </div>
          ))}

          {count === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">등록된 다음 행동이 없습니다.</p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
