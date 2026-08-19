import Link from "next/link";
import { CalendarDays, CheckCircle2, ExternalLink, FileText, Pencil, Plus, ReceiptText } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schedules = [
  { label: "선금 30%", service: "집합교육", amount: "1,080만원", date: "8월 22일", status: "발행 예정", invoice: "invoice-1" },
  { label: "중도금 40%", service: "집합교육", amount: "1,440만원", date: "9월 30일", status: "예정", invoice: "invoice-2" },
  { label: "잔금 30%", service: "집합교육", amount: "1,080만원", date: "11월 28일", status: "예정", invoice: "invoice-3" },
];

export default function ContractDetailPage() {
  return <><ScreenHeader title="다원그룹 계약" description="계약 상세" backHref="/billing" /><div className="space-y-6 px-4 py-5"><Card><CardHeader><div className="flex items-start justify-between gap-3"><div><div className="flex gap-2"><Badge>서명 완료</Badge><Badge variant="secondary">80%</Badge></div><CardTitle className="mt-3">총 5,600만원</CardTitle><p className="mt-1 text-sm text-muted-foreground">VAT 포함 · 2026년 8월 18일</p></div><Button asChild variant="outline" size="icon-sm"><Link href="/contracts/dawon-group/edit" aria-label="계약 수정"><Pencil /></Link></Button></div></CardHeader><CardContent className="grid grid-cols-2 gap-3"><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">집합교육</p><p className="mt-1 font-semibold">3,600만원</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">변화관리</p><p className="mt-1 font-semibold">2,000만원</p></div></CardContent></Card><section className="space-y-3"><SectionHeading title="청구 일정" count={3} actionHref="/contracts/dawon-group/invoices/new" actionLabel="추가" />{schedules.map((item) => <Card key={item.label} className="py-4"><CardContent className="space-y-3 px-4"><div className="flex items-start justify-between"><div><div className="flex gap-2"><Badge variant={item.status === "발행 예정" ? "secondary" : "outline"}>{item.status}</Badge><span className="ml-2 text-xs text-muted-foreground">{item.service}</span></div><p className="mt-2 font-semibold">{item.label} · {item.amount}</p></div><CalendarDays className="size-4 text-muted-foreground" /></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">예정 발행일</span><span>{item.date}</span></div><Button asChild variant="outline" size="sm" className="w-full"><Link href={`/invoices/${item.invoice}`}><ReceiptText /> 계산서 상세</Link></Button></CardContent></Card>)}</section><section className="space-y-3"><SectionHeading title="계약 문서" /><Card className="py-0"><CardContent className="flex items-center gap-3 px-4 py-4"><FileText className="size-5 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">다원그룹_AX교육_계약서.pdf</p><p className="mt-1 text-xs text-muted-foreground">Google Drive</p></div><Button variant="ghost" size="icon-sm"><ExternalLink /></Button></CardContent></Card></section><Card className="border-dashed"><CardContent className="flex gap-3 text-sm text-muted-foreground"><CheckCircle2 className="size-5 shrink-0" />첫 번째 유효 계산서가 발행되면 영업 성공 확률이 100%로 전환됩니다.</CardContent></Card><Button asChild className="w-full"><Link href="/contracts/dawon-group/invoices/new"><Plus /> 청구 일정 추가</Link></Button></div></>;
}
