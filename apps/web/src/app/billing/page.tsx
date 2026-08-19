import {
  AlertCircle,
  CalendarCheck,
  Check,
  CircleDollarSign,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/metric-card";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { billingItems } from "@/lib/mock-data";

export default function BillingPage() {
  return (
    <>
      <ScreenHeader title="계약·청구" description="8월 발행과 입금 현황" showSearch />
      <div className="space-y-6 px-4 py-5">
        <section className="grid grid-cols-2 gap-3">
          <MetricCard
            label="발행 예정"
            value="4,880만원"
            note="2건"
            icon={CalendarCheck}
          />
          <MetricCard
            label="미수금"
            value="640만원"
            note="1건 · 2일 지연"
            icon={AlertCircle}
          />
        </section>

        <section className="space-y-3">
          <SectionHeading title="처리가 필요한 청구" count={3} />
          {billingItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge
                      variant={item.status === "미수금" ? "destructive" : "secondary"}
                    >
                      {item.status}
                    </Badge>
                    <CardTitle className="mt-3 text-base">{item.company}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.service} · {item.label}
                    </p>
                  </div>
                  <p className="font-bold">{item.amount}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">처리 시점</span>
                  <span className="font-medium">{item.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/invoices/${item.id}`}><ReceiptText /> 상세</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={item.status === "발행 예정" ? `/invoices/${item.id}` : `/invoices/${item.id}/payment`}>
                      {item.status === "발행 예정" ? <ReceiptText /> : <Check />}
                      {item.status === "발행 예정" ? "발행 기록" : "입금 기록"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
            <CircleDollarSign className="mt-0.5 size-5 shrink-0" />
            계약 상세에서는 서비스별 계약 금액, 선금·중도금·잔금 일정과 수정·환불
            이력을 함께 관리합니다.
          </CardContent>
        </Card>

        <Button asChild className="w-full">
          <Link href="/contracts/new">계약 등록</Link>
        </Button>
      </div>
    </>
  );
}
