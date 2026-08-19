import Link from "next/link";
import { Check, FileText, Pencil, ReceiptText } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoiceDetailPage() {
  return <><ScreenHeader title="계산서 상세" description="다원그룹 · 집합교육" backHref="/contracts/dawon-group" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><div className="flex items-start justify-between"><div><Badge variant="secondary">발행 예정</Badge><CardTitle className="mt-3 text-2xl">1,080만원</CardTitle><p className="mt-1 text-sm text-muted-foreground">선금 30% · VAT 포함</p></div><ReceiptText className="size-6 text-muted-foreground" /></div></CardHeader><CardContent className="space-y-3 text-sm">{[["예정 발행일", "2026년 8월 22일"], ["실제 발행일", "미발행"], ["입금 예정일", "2026년 8월 29일"], ["실제 입금", "미입금"]].map(([label, value]) => <div key={label} className="flex justify-between border-b pb-3 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>)}</CardContent></Card><Card><CardHeader><CardTitle>발행 기록</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3 rounded-lg bg-muted p-3"><FileText className="size-5" /><div><p className="text-sm font-medium">계산서 파일·번호</p><p className="text-xs text-muted-foreground">발행 후 입력</p></div></div><Button className="w-full"><Check /> 계산서 발행 완료 기록</Button></CardContent></Card><div className="grid grid-cols-2 gap-3"><Button asChild variant="outline"><Link href="/invoices/invoice-1/adjustment"><Pencil /> 수정·취소</Link></Button><Button asChild><Link href="/invoices/invoice-1/payment"><Check /> 입금 기록</Link></Button></div></div></>;
}
