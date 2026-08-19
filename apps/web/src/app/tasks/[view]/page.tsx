import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ReceiptText } from "lucide-react";

import { DealCard } from "@/components/deal-card";
import { ScopeSwitch } from "@/components/scope-switch";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { billingItems, deals } from "@/lib/mock-data";

const views = {
  overdue: { title: "기한 초과", description: "가장 오래 지연된 순", indexes: [1, 0, 3] },
  today: { title: "오늘 예정", description: "오늘 실행할 다음 행동", indexes: [0, 2, 3] },
  new: { title: "신규 접수", description: "유효성 판단과 1차 연락", indexes: [0, 1] },
  delegated: { title: "위임받은 건", description: "대표님에게 전달받은 영업 건", indexes: [1] },
  "quote-followup": { title: "견적 후 재연락", description: "견적 발송 뒤 응답 대기", indexes: [3, 2] },
  invoice: { title: "계산서 발행 예정", description: "D-3과 오늘 발행 대상", indexes: [] },
  receivables: { title: "미수금 확인", description: "입금 예정일이 지난 계산서", indexes: [] },
} as const;

export function generateStaticParams() {
  return Object.keys(views).map((view) => ({ view }));
}

export default async function TaskViewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  const config = views[view as keyof typeof views];
  if (!config) notFound();
  const isBilling = view === "invoice" || view === "receivables";
  const billingTargets = billingItems.filter((item) =>
    view === "invoice" ? item.status === "발행 예정" : item.status === "미수금",
  );

  return (
    <>
      <ScreenHeader title={config.title} description={config.description} backHref="/" />
      <div className="space-y-5 px-4 py-5">
        <ScopeSwitch />
        <p className="text-sm font-semibold">처리 대상 {isBilling ? billingTargets.length : config.indexes.length}건</p>
        {isBilling ? (
          <div className="space-y-3">
            {billingTargets.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div><Badge variant={item.status === "미수금" ? "destructive" : "secondary"}>{item.status}</Badge><CardTitle className="mt-3 text-base">{item.company}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{item.service} · {item.label}</p></div>
                    <p className="font-bold">{item.amount}</p>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm"><Link href={`/invoices/${item.id}`}><ReceiptText /> 상세</Link></Button>
                  <Button asChild size="sm"><Link href={view === "invoice" ? `/invoices/${item.id}` : `/invoices/${item.id}/payment`}><Check /> {view === "invoice" ? "발행 기록" : "입금 기록"}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">{config.indexes.map((index) => <DealCard key={deals[index]!.id} deal={deals[index]!} />)}</div>
        )}
      </div>
    </>
  );
}
