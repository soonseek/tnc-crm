import Link from "next/link";
import { Plus } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NewInvoiceSchedulePage() {
  return <><ScreenHeader title="청구 일정 추가" description="다원그룹 계약" backHref="/contracts/dawon-group" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><CardTitle>계산서 계획</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="연결 서비스" required><FrameSelect value="집합교육" /></FrameField><FrameField label="청구 구분"><FrameSelect value="선금" /></FrameField><FrameField label="계약 금액" value="36,000,000원" /><div className="grid grid-cols-2 gap-3"><FrameField label="지급 비율"><Input defaultValue="30%" /></FrameField><FrameField label="예정 금액"><Input defaultValue="10,800,000" /></FrameField></div><FrameField label="예정 발행일"><FrameSelect value="2026년 8월 22일" /></FrameField><FrameField label="입금 예정일"><FrameSelect value="2026년 8월 29일" /></FrameField><div className="rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">현재 서비스의 청구 비율 합계는 100%입니다. 일정 변경 시 합계를 다시 검증합니다.</div></CardContent></Card><Button asChild className="w-full"><Link href="/contracts/dawon-group"><Plus /> 청구 일정 등록</Link></Button></div></>;
}
