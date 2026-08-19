import Link from "next/link";
import { Check, X } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ApprovalDetailPage() {
  return <><ScreenHeader title="승인 요청 상세" description="계산서 발행일 변경" backHref="/approvals" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>다원그룹 · 선금</CardTitle><Badge variant="secondary">승인 대기</Badge></div></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">요청자</span><span>AI 영업 에이전트</span></div><div className="flex justify-between"><span className="text-muted-foreground">요청 시각</span><span>오늘 오후 2:10</span></div><div className="flex justify-between"><span className="text-muted-foreground">영향 금액</span><span>1,080만원</span></div></CardContent></Card><Card><CardHeader><CardTitle>변경 전후</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3"><div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">변경 전</p><p className="mt-2 font-semibold">8월 22일</p></div><div className="rounded-lg border border-foreground bg-muted p-3"><p className="text-xs text-muted-foreground">변경 후</p><p className="mt-2 font-semibold">8월 25일</p></div><div className="col-span-2 rounded-lg bg-muted p-3 text-sm"><p className="text-xs text-muted-foreground">요청 사유</p><p className="mt-2 leading-6">고객사의 내부 결재 일정 변경이 상담 메모에서 확인되었습니다.</p></div></CardContent></Card><Card><CardHeader><CardTitle>검토 메모</CardTitle></CardHeader><CardContent><Textarea placeholder="승인 또는 반려 사유를 기록하세요." /></CardContent></Card><div className="grid grid-cols-2 gap-3"><Button asChild variant="outline"><Link href="/approvals"><X /> 반려</Link></Button><Button asChild><Link href="/invoices/invoice-1"><Check /> 승인</Link></Button></div></div></>;
}
