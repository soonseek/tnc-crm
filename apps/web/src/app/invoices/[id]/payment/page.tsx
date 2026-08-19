import Link from "next/link";
import { Check } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PaymentPage() {
  return <><ScreenHeader title="입금 기록" description="다원그룹 · 선금" backHref="/invoices/invoice-1" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><CardTitle>계산서 정보</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted-foreground">발행 금액</p><p className="mt-1 font-bold">1,080만원</p></div><div><p className="text-muted-foreground">입금 예정일</p><p className="mt-1 font-bold">8월 29일</p></div></CardContent></Card><Card><CardHeader><CardTitle>실제 입금</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="실제 입금일" required><FrameSelect value="2026년 8월 29일" /></FrameField><FrameField label="실제 입금액" required helper="부분 입금 미지원"><Input defaultValue="10,800,000" /></FrameField><FrameField label="입금 확인자" value="김정석" /></CardContent></Card><Button asChild className="w-full"><Link href="/invoices/invoice-1"><Check /> 입금 완료 저장</Link></Button></div></>;
}
