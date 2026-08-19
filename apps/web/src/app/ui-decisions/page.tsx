import Link from "next/link";
import { ChevronRight, Eye, Layers2, Smartphone } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import {
  ActionHierarchyVisual,
  DecisionExample,
  DensityVisual,
  MoneyVisual,
  SaveVisual,
  StatusVisual,
  TransitionVisual,
} from "@/components/ui-decision-visuals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UiDecisionsPage() {
  return (
    <>
      <ScreenHeader title="UI 의사결정" description="1차 · 실제 UI 비교" backHref="/more" />
      <div className="space-y-8 px-4 py-5">
        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <Layers2 className="mt-0.5 size-5 shrink-0" />
            동일한 영업 상황을 서로 다른 UI로 구현했습니다. 설명보다 실제 조작 화면의 차이를 기준으로 선택합니다.
          </CardContent>
        </Card>

        <DecisionExample number="01" title="정보 밀도" context="오늘 할 일에서 고객 맥락을 읽고 바로 연락하는 상황">
          <DensityVisual />
        </DecisionExample>

        <DecisionExample number="02" title="저장 방식" context="계약 금액처럼 잘못 반영되면 영향이 큰 값을 수정하는 상황">
          <SaveVisual />
        </DecisionExample>

        <DecisionExample number="03" title="화면 전환" context="계산서 수정과 담당자 선택처럼 복잡도가 다른 작업">
          <TransitionVisual />
        </DecisionExample>

        <DecisionExample number="04" title="행동 버튼 위계" context="고객 응답을 확인한 뒤 다음 행동을 선택하는 상황">
          <ActionHierarchyVisual />
        </DecisionExample>

        <DecisionExample number="05" title="상태 피드백" context="여러 단계 중 지금 즉시 대응할 건을 찾는 상황">
          <StatusVisual />
        </DecisionExample>

        <DecisionExample number="06" title="금액·날짜 표현" context="정확한 계약 입력과 빠른 목록·성과 확인을 오가는 상황">
          <MoneyVisual />
        </DecisionExample>

        <Card className="py-4">
          <CardContent className="space-y-3 px-4">
            <div className="flex items-center gap-2"><Eye className="size-4" /><p className="text-sm font-semibold">검수 방법</p></div>
            <p className="text-xs leading-5 text-muted-foreground">각 번호에서 A와 B를 비교하고, 03번은 두 화면을 함께 사용하는 혼합 규칙을 확인합니다.</p>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground"><Smartphone className="size-4 shrink-0" />승인 후 동일 규칙을 46개 전체 화면에 적용합니다.</div>
            <Button asChild variant="outline" className="w-full"><Link href="/frames">전체 프레임 다시 보기 <ChevronRight /></Link></Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
