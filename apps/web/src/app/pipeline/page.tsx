import Link from "next/link";
import { CircleDollarSign, SlidersHorizontal } from "lucide-react";

import { DealCard } from "@/components/deal-card";
import { ScreenHeader } from "@/components/screen-header";
import { ScopeSwitch } from "@/components/scope-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deals, pipelineStages } from "@/lib/mock-data";

export default function PipelinePage() {
  return (
    <>
      <ScreenHeader
        title="영업판"
        description="단계별 흐름과 정체 건"
        showSearch
        showAdd
      />
      <div className="space-y-5 px-4 py-5">
        <ScopeSwitch />

        <section className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
          <div className="flex min-w-max gap-2 pb-1">
            {pipelineStages.map((stage, index) => (
              <Card
                key={stage.name}
                surface={index === 0 ? "solid" : "data"}
                className={
                  index === 0
                    ? "w-36 border-foreground bg-foreground py-4 text-background"
                    : "w-36 py-4"
                }
              >
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{stage.name}</p>
                    <span className="text-lg font-bold">{stage.count}</span>
                  </div>
                  <p
                    className={
                      index === 0
                        ? "mt-2 text-xs text-background/70"
                        : "mt-2 text-xs text-muted-foreground"
                    }
                  >
                    {stage.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">신규</h2>
            <p className="text-xs text-muted-foreground">미확인과 1차 연락 대기</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/pipeline/filter"><SlidersHorizontal /> 필터</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {deals.slice(0, 3).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
            <CircleDollarSign className="size-5" />
            큰 단계 선택, 카드 이동 방식은 이번 프레임 검수 대상입니다.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
