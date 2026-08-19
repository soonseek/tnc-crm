import {
  Banknote,
  CircleDollarSign,
  ReceiptText,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stageForecast = [
  { name: "신규·초기", probability: "0~5%", value: 12 },
  { name: "후속 진행", probability: "10%", value: 28 },
  { name: "제안·협의", probability: "20~40%", value: 55 },
  { name: "계약", probability: "60~100%", value: 82 },
];

const services = [
  { name: "AX 구축", value: "1.4억원", share: "41%" },
  { name: "집합교육", value: "9,200만원", share: "27%" },
  { name: "변화관리", value: "7,600만원", share: "22%" },
  { name: "1:1 코칭", value: "3,400만원", share: "10%" },
];

export default function PerformancePage() {
  return (
    <>
      <ScreenHeader title="성과" description="2026년 8월" />
      <div className="space-y-6 px-4 py-5">
        <section className="grid grid-cols-2 gap-3">
          <MetricCard
            label="가중 예상 수주"
            value="8,640만원"
            note="예상 계약 월 기준"
            icon={TrendingUp}
          />
          <MetricCard
            label="발행 예정"
            value="6,200만원"
            note="이번 달"
            icon={ReceiptText}
          />
          <MetricCard
            label="실제 발행"
            value="4,980만원"
            note="취소·환불 전"
            icon={CircleDollarSign}
          />
          <MetricCard
            label="실제 입금"
            value="4,340만원"
            note="미수금 640만원"
            icon={Banknote}
          />
        </section>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>파이프라인 가치</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">전체 진행 건 24개</p>
              </div>
              <Badge variant="outline">총 6.6억원</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageForecast.map((stage) => (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {stage.probability}
                  </span>
                </div>
                <Progress value={stage.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="space-y-3">
          <SectionHeading title="서비스별 추산 가치" />
          <Card className="gap-0 py-0">
            <CardContent className="divide-y px-0">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                      <WalletCards className="size-4" />
                    </div>
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{service.value}</p>
                    <p className="text-xs text-muted-foreground">{service.share}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

