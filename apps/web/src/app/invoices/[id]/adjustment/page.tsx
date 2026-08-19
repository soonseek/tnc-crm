import Link from "next/link";
import { AlertTriangle, Send } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function InvoiceAdjustmentPage() {
  return <><ScreenHeader title="수정·취소·환불" description="관리자 승인 필요" backHref="/invoices/invoice-1" /><div className="space-y-5 px-4 py-5"><Card className="border-foreground/30"><CardContent className="flex gap-3 text-sm leading-6"><AlertTriangle className="mt-0.5 size-5 shrink-0" />재무 데이터 변경은 승인 전까지 실제 금액에 반영되지 않으며 변경 전후 값이 계속 보관됩니다.</CardContent></Card><Card><CardHeader><CardTitle>변경 요청</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="변경 유형" required><FrameSelect value="계산서 수정" /></FrameField><FrameField label="현재 금액" value="10,800,000원" /><FrameField label="변경 금액"><Input defaultValue="10,800,000" /></FrameField><FrameField label="변경 발행일"><FrameSelect value="2026년 8월 25일" /></FrameField><FrameField label="변경 사유" required><Textarea placeholder="승인자가 판단할 수 있도록 사유를 입력하세요." /></FrameField><FrameField label="승인자"><FrameSelect value="김정석 또는 대표님 · 1명 승인" /></FrameField></CardContent></Card><Button asChild className="w-full"><Link href="/approvals/approval-1"><Send /> 승인 요청</Link></Button></div></>;
}
