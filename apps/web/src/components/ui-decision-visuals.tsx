import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DecisionExample({
  number,
  title,
  context,
  children,
}: {
  number: string;
  title: string;
  context: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3" id={`decision-${number}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xs font-semibold text-muted-foreground">{number}</span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{context}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Variant({
  label,
  selected = false,
  children,
}: {
  label: string;
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden py-0", selected && "border-2 border-foreground")}>
      <div className={cn("flex items-center justify-between border-b px-4 py-3", selected && "bg-muted/70")}>
        <p className="text-sm font-semibold">{label}</p>
        {selected ? <Badge><Check className="size-3" /> 권장</Badge> : <Badge variant="outline">대안</Badge>}
      </div>
      <CardContent className="px-4 py-4">{children}</CardContent>
    </Card>
  );
}

function MiniScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <ArrowLeft className="size-3.5" />
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function MockField({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {danger ? <span className="text-[10px] text-destructive">확인 필요</span> : null}
      </div>
      <div className={cn("rounded-md border px-2.5 py-2 text-xs", danger && "border-destructive")}>{value}</div>
    </div>
  );
}

export function DensityVisual() {
  return (
    <div className="space-y-3">
      <Variant label="A · 여유형 카드" selected>
        <div className="space-y-3 rounded-xl border p-3">
          <div className="flex items-start justify-between">
            <div><Badge variant="destructive">1일 지연</Badge><p className="mt-2 text-sm font-bold">세움테크</p><p className="mt-1 text-xs text-muted-foreground">김하늘 조직문화파트장</p></div>
            <Badge variant="outline">위임</Badge>
          </div>
          <p className="truncate text-xs"><span className="text-muted-foreground">초기 요청 · </span>교육 이후 현업 적용을 위한 3개월 변화관리 요청</p>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-2.5 text-xs">
            <div><p className="text-muted-foreground">다음 기한</p><p className="mt-1 font-semibold">오늘 · 1일 지연</p></div>
            <div><p className="text-muted-foreground">서비스·추산</p><p className="mt-1 font-semibold">변화관리 · 3,200만원</p></div>
          </div>
          <div className="grid grid-cols-3 gap-1.5"><Button size="sm" variant="outline"><Phone /> 전화</Button><Button size="sm">완료</Button><Button size="sm" variant="outline">위임</Button></div>
        </div>
      </Variant>
      <Variant label="B · 압축형 목록">
        <div className="divide-y rounded-xl border">
          {[
            ["세움테크", "고객 응답 대기", "1일 지연"],
            ["한빛모빌리티", "1차 연락 대기", "오늘 2:30"],
            ["그린웨이브", "미팅 일정 확정", "오늘 4:00"],
          ].map(([company, status, due]) => (
            <div key={company} className="flex items-center gap-2 px-3 py-2.5">
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{company}</p><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{status}</p></div>
              <span className="text-[11px] text-muted-foreground">{due}</span><ChevronRight className="size-3.5" />
            </div>
          ))}
        </div>
      </Variant>
    </div>
  );
}

export function SaveVisual() {
  return (
    <div className="space-y-3">
      <Variant label="A · 중요 입력은 명시적 저장" selected>
        <MiniScreen title="계약 금액 수정">
          <div className="space-y-3">
            <MockField label="집합교육 계약 금액" value="36,000,000원" />
            <MockField label="변화관리 계약 금액" value="20,000,000원" />
            <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-2 text-[11px]"><span className="size-2 rounded-full bg-foreground" />저장하지 않은 변경 2개</div>
            <Button size="sm" className="w-full"><Save /> 계약 변경 저장</Button>
          </div>
        </MiniScreen>
      </Variant>
      <Variant label="B · 모든 항목 자동 저장">
        <MiniScreen title="계약 금액 수정">
          <div className="space-y-3">
            <MockField label="집합교육 계약 금액" value="360,000,000원" danger />
            <div className="flex items-center justify-between rounded-md bg-muted px-2.5 py-2 text-[11px]"><span>자동 저장 완료</span><span className="text-muted-foreground">오후 2:32</span></div>
            <div className="flex items-start gap-2 text-[11px] leading-5 text-destructive"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" />입력한 금액이 이미 계약 합계에 반영됨</div>
          </div>
        </MiniScreen>
      </Variant>
    </div>
  );
}

export function TransitionVisual() {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="border-b bg-muted/60 py-3"><div className="flex items-center justify-between"><CardTitle className="text-sm">혼합 규칙</CardTitle><Badge><Check /> 권장</Badge></div></CardHeader>
      <CardContent className="space-y-4 px-4 py-4">
        <div>
          <div className="mb-2 flex items-center gap-2"><Badge variant="outline">4개 이상·재무</Badge><p className="text-xs font-semibold">전체 화면</p></div>
          <MiniScreen title="계산서 수정">
            <div className="space-y-2.5"><MockField label="변경 유형" value="계산서 수정" /><MockField label="변경 금액" value="10,800,000원" /><MockField label="변경 발행일" value="2026년 8월 25일" /><MockField label="변경 사유" value="고객 결재 일정 변경" /><Button size="sm" className="w-full">승인 요청</Button></div>
          </MiniScreen>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2"><Badge variant="outline">단일 선택·확인</Badge><p className="text-xs font-semibold">하단 시트</p></div>
          <div className="relative overflow-hidden rounded-xl border bg-muted/60 pt-16">
            <div className="absolute inset-x-3 top-3 h-12 rounded-lg border bg-background/60 p-2 text-[10px] text-muted-foreground">한빛모빌리티 · 담당자 변경</div>
            <div className="rounded-t-2xl border-t bg-background p-3 shadow-lg">
              <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-border" />
              <p className="text-xs font-semibold">새 담당자 선택</p>
              <div className="mt-3 space-y-2">{["김정석", "대표님"].map((name, index) => <div key={name} className={cn("flex items-center gap-2 rounded-lg border p-2.5 text-xs", index === 1 && "border-foreground bg-muted")}><UserRound className="size-3.5" /><span className="flex-1">{name}</span>{index === 1 ? <CheckCircle2 className="size-4" /> : null}</div>)}</div>
              <Button size="sm" className="mt-3 w-full">선택 완료</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActionHierarchyVisual() {
  return (
    <div className="space-y-3">
      <Variant label="A · 핵심 행동 1개" selected>
        <div className="space-y-3 rounded-xl border p-3">
          <div><Badge variant="secondary">고객 응답 대기</Badge><p className="mt-2 text-sm font-bold">세움테크</p><p className="mt-1 text-xs text-muted-foreground">고객의 회신을 확인했습니다.</p></div>
          <Button size="sm" className="w-full"><Check /> 응답 기록</Button>
          <div className="grid grid-cols-2 gap-2"><Button size="sm" variant="outline"><Clock3 /> 나중에</Button><Button size="sm" variant="ghost" className="text-destructive"><X /> 실패 처리</Button></div>
        </div>
      </Variant>
      <Variant label="B · 모든 행동을 동일하게 강조">
        <div className="space-y-2 rounded-xl border p-3"><Button size="sm" className="w-full">응답 기록</Button><Button size="sm" className="w-full">나중에</Button><Button size="sm" className="w-full">실패 처리</Button></div>
      </Variant>
    </div>
  );
}

export function StatusVisual() {
  const rows = [
    ["한빛모빌리티", "1차 연락 대기", "오늘 2:30"],
    ["그린웨이브", "미팅 일정 확정", "오늘 4:00"],
    ["세움테크", "1일 지연", "즉시 확인"],
  ];
  return (
    <div className="space-y-3">
      <Variant label="A · 의미를 제한한 상태색" selected>
        <div className="divide-y rounded-xl border">{rows.map(([company, status, due], index) => <div key={company} className="flex items-center gap-2 px-3 py-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{company}</p><p className="mt-1 text-[11px] text-muted-foreground">{due}</p></div><Badge variant={index === 2 ? "destructive" : "secondary"}>{status}</Badge></div>)}</div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground" /> 정상 단계</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-destructive" /> 즉시 대응</span></div>
      </Variant>
      <Variant label="B · 단계마다 다른 색상">
        <div className="divide-y rounded-xl border">{rows.map(([company, status, due], index) => { const colors = ["bg-blue-100 text-blue-800", "bg-violet-100 text-violet-800", "bg-orange-100 text-orange-800"]; return <div key={company} className="flex items-center gap-2 px-3 py-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{company}</p><p className="mt-1 text-[11px] text-muted-foreground">{due}</p></div><span className={cn("rounded-md px-2 py-1 text-[10px] font-semibold", colors[index])}>{status}</span></div>; })}</div>
      </Variant>
    </div>
  );
}

export function MoneyVisual() {
  return (
    <div className="space-y-3">
      <Variant label="A · 화면 맥락에 맞춰 단위 전환" selected>
        <div className="space-y-3">
          <div className="rounded-xl border p-3"><div className="mb-3 flex items-center gap-2"><Save className="size-3.5" /><p className="text-xs font-semibold">입력·계약 상세</p></div><MockField label="총 계약 금액 · VAT 포함" value="56,000,000원" /><div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5" />2026년 8월 18일</div></div>
          <div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-muted p-3"><p className="text-[11px] text-muted-foreground">목록 요약</p><p className="mt-1 text-base font-bold">5,600만원</p><p className="mt-1 text-[11px] text-muted-foreground">8월 18일</p></div><div className="rounded-xl bg-muted p-3"><p className="text-[11px] text-muted-foreground">성과 합계</p><p className="mt-1 text-base font-bold">1.2억원</p><p className="mt-1 text-[11px] text-muted-foreground">이번 달</p></div></div>
        </div>
      </Variant>
      <Variant label="B · 모든 화면에서 원 단위">
        <div className="space-y-2 rounded-xl border p-3 text-xs">{[["다원그룹", "56,000,000원"], ["코어링크", "85,000,000원"], ["월간 파이프라인", "660,000,000원"]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"><span className="truncate text-muted-foreground">{label}</span><span className="shrink-0 font-semibold tabular-nums">{value}</span></div>)}</div>
      </Variant>
    </div>
  );
}
