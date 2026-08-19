import Link from "next/link";
import { RotateCcw, Search } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PipelineFilterPage() {
  return (
    <>
      <ScreenHeader title="영업판 필터" description="현재 조건에서 7건" backHref="/pipeline" />
      <div className="space-y-5 px-4 py-5">
        <Card>
          <CardHeader><CardTitle>조회 범위</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FrameField label="담당 범위"><FrameSelect value="내 담당" /></FrameField>
            <FrameField label="큰 단계"><FrameSelect value="신규, 초기 상담" /></FrameField>
            <FrameField label="세부 상태"><FrameSelect value="전체 상태" /></FrameField>
            <FrameField label="관심 서비스"><FrameSelect value="전체 서비스" /></FrameField>
            <FrameField label="다음 행동 기한"><FrameSelect value="기한 초과 + 7일 이내" /></FrameField>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline"><RotateCcw /> 초기화</Button>
          <Button asChild><Link href="/pipeline"><Search /> 7건 보기</Link></Button>
        </div>
      </div>
    </>
  );
}
