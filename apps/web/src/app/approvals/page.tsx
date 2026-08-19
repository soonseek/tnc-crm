import Link from "next/link";
import { Bot, ChevronRight, FilePenLine, ReceiptText } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const approvals = [
  { id: "approval-1", title: "계산서 발행일 변경", target: "다원그룹 · 선금 1,080만원", requester: "AI 영업 에이전트", time: "10분 전", icon: ReceiptText },
  { id: "approval-2", title: "계약 금액 수정", target: "코어링크 · AX 구축 서비스", requester: "대표님", time: "오늘 오전 9:20", icon: FilePenLine },
];

export default function ApprovalsPage() {
  return <><ScreenHeader title="승인 대기" description="중요 변경 요청 2건" backHref="/more" /><div className="space-y-4 px-4 py-5"><div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground"><Bot className="size-4 shrink-0" />AI 요청은 즉시 알리고 미처리 시 업무일 오전 9시에 다시 알립니다.</div><Card className="gap-0 py-0"><CardContent className="divide-y px-0">{approvals.map((item) => { const Icon = item.icon; return <Link key={item.id} href={`/approvals/${item.id}`} className="flex items-start gap-3 px-4 py-4"><div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted"><Icon className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex gap-2"><p className="text-sm font-semibold">{item.title}</p><Badge variant="secondary">대기</Badge></div><p className="mt-1 text-sm">{item.target}</p><p className="mt-1 text-xs text-muted-foreground">{item.requester} · {item.time}</p></div><ChevronRight className="mt-2 size-4 text-muted-foreground" /></Link>; })}</CardContent></Card></div></>;
}
