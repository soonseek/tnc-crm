import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Layers3,
  Navigation,
  Phone,
  ReceiptText,
  TrendingUp,
  UserRoundCog,
} from "lucide-react";

import { GlassSurface } from "@/components/glass-surface";
import { MetricCard } from "@/components/metric-card";
import { ScreenHeader } from "@/components/screen-header";
import { ScopeSwitch } from "@/components/scope-switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ThemePreviewPage() {
  return (
    <>
      <ScreenHeader title="트루노스크루 CRM" description="절제형 코발트 글래스" backHref="/more" />
      <div className="space-y-6 px-4 py-5">
        <GlassSurface strength="strong" className="relative overflow-hidden rounded-2xl">
          <div className="absolute -right-10 -top-12 size-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="h-1.5 bg-primary" />
          <div className="relative p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Navigation className="size-5 fill-current" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-primary">TRUE NORTH CREW</p>
                <p className="mt-0.5 text-xs text-muted-foreground">SALES AUTOMATION</p>
              </div>
              <Badge variant="secondary" className="ml-auto">B · 절제형</Badge>
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight">오늘의 영업 방향을<br />놓치지 않습니다.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">이동 중에도 다음 행동과 기한을 빠르게 확인하세요.</p>
          </div>
        </GlassSurface>

        <ScopeSwitch />

        <section className="grid grid-cols-2 gap-3">
          <MetricCard label="기한 초과" value="3" note="즉시 확인" icon={AlertTriangle} />
          <MetricCard label="오늘 할 일" value="5" note="오후 4시까지" icon={CalendarClock} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">먼저 처리하세요</h2><p className="mt-1 text-xs text-muted-foreground">고객 응답 대기 · 1일 지연</p></div><Badge variant="destructive">우선 처리</Badge></div>
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div><Badge variant="secondary">변화관리</Badge><CardTitle className="mt-3">세움테크</CardTitle><p className="mt-1 text-sm text-muted-foreground">김하늘 조직문화파트장</p></div>
                <Badge variant="outline">위임</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="truncate text-sm"><span className="text-muted-foreground">초기 요청 · </span>교육 이후 현업 적용을 위한 3개월 변화관리 요청</p>
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 text-xs"><div><p className="text-muted-foreground">다음 기한</p><p className="mt-1 font-semibold">오늘 · 1일 지연</p></div><div><p className="text-muted-foreground">추산 가치</p><p className="mt-1 font-semibold">3,200만원</p></div></div>
              <Button className="w-full"><Check /> 고객 응답 기록</Button>
              <div className="grid grid-cols-2 gap-2"><Button variant="outline"><Phone /> 전화</Button><Button variant="ghost"><UserRoundCog /> 위임</Button></div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="font-semibold">이번 달 성과</h2><Button asChild variant="ghost" size="sm"><Link href="/performance">전체 <ChevronRight /></Link></Button></div>
          <Card surface="glass" className="rounded-2xl">
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4"><div><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="size-3.5" /> 가중 예상 수주</p><p className="mt-1 text-xl font-bold">8,640만원</p></div><div><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ReceiptText className="size-3.5" /> 실제 발행</p><p className="mt-1 text-xl font-bold">4,980만원</p></div></div>
              <div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-muted-foreground">계약 단계 목표</span><span className="font-semibold">82%</span></div><Progress value={82} /></div>
            </CardContent>
          </Card>
        </section>

        <GlassSurface className="rounded-2xl border-dashed py-5">
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2"><Layers3 className="size-5 text-primary" /><p className="font-semibold">글래스 시스템</p></div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground">
              <div className="rounded-xl border border-white/80 bg-white/80 p-3 shadow-sm"><p className="font-semibold text-foreground">82%</p><p className="mt-1">요약 표면</p></div>
              <div className="rounded-xl border border-white/80 bg-white/95 p-3 shadow-sm"><p className="font-semibold text-foreground">95%</p><p className="mt-1">업무 카드</p></div>
              <div className="rounded-xl border border-white/80 bg-white/80 p-3 shadow-sm"><p className="font-semibold text-foreground">18px</p><p className="mt-1">기본 블러</p></div>
            </div>
            <div className="flex items-center gap-2"><CircleDollarSign className="size-5 text-primary" /><p className="font-semibold">브랜드 토큰</p></div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-muted-foreground">
              {[["#0047FF", "bg-primary"], ["#F4F5F6", "bg-background"], ["#FFFFFF", "bg-card"], ["위험", "bg-destructive"]].map(([label, color]) => <div key={label}><div className={`mx-auto mb-1.5 size-8 rounded-md border ${color}`} /><span>{label}</span></div>)}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">Pretendard Variable · 라이트 전용 · 코발트는 핵심 행동과 선택 상태에만 사용 · 투명도 감소 시 불투명 표면으로 자동 전환</p>
          </CardContent>
        </GlassSurface>
      </div>
    </>
  );
}
