import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronRight, Mail, Pencil, Phone, UserRound } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deals } from "@/lib/mock-data";

export function generateStaticParams() { return deals.map((deal) => ({ id: deal.id })); }

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = deals.find((item) => item.id === id);
  if (!deal) notFound();
  return <><ScreenHeader title={deal.company} description="회사 상세" backHref="/companies" /><div className="space-y-6 px-4 py-5"><Card><CardHeader><div className="flex items-start gap-3"><div className="flex size-11 items-center justify-center rounded-lg bg-muted"><Building2 className="size-5" /></div><div className="min-w-0 flex-1"><CardTitle>{deal.company}</CardTitle><div className="mt-2 flex gap-2"><Badge variant="outline">201~500명</Badge><Badge variant="secondary">활성 고객</Badge></div></div><Button asChild variant="outline" size="icon-sm"><Link href={`/companies/${id}/edit`} aria-label="회사 정보 수정"><Pencil /></Link></Button></div></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex gap-3"><UserRound className="size-4 text-muted-foreground" /><span>PM 김정석 · 투입 인력 3명</span></div><div className="flex gap-3"><Phone className="size-4 text-muted-foreground" /><span>010-1234-5678</span></div><div className="flex gap-3"><Mail className="size-4 text-muted-foreground" /><span>hr@sample-company.co.kr</span></div></CardContent></Card><section className="space-y-3"><SectionHeading title="진행 중인 영업 건" count={2} /><Card className="gap-0 py-0"><CardContent className="divide-y px-0">{[deal, deals[3] ?? deal].map((item) => <Link key={item.id} href={`/deals/${item.id}`} className="flex items-center gap-3 px-4 py-4"><div className="min-w-0 flex-1"><div className="flex gap-2"><Badge>{item.stage}</Badge><Badge variant="secondary">{item.status}</Badge></div><p className="mt-2 text-sm font-semibold">{item.service} · {item.value}</p><p className="mt-1 truncate text-xs text-muted-foreground">{item.initialRequest}</p></div><ChevronRight className="size-4 text-muted-foreground" /></Link>)}</CardContent></Card></section><section className="space-y-3"><SectionHeading title="계약·매출 요약" /><Card><CardContent className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-muted-foreground">누적 계약</p><p className="mt-1 text-lg font-bold">1.2억원</p></div><div><p className="text-muted-foreground">실제 입금</p><p className="mt-1 text-lg font-bold">8,400만원</p></div></CardContent></Card></section><section className="space-y-3"><SectionHeading title="과거 이력" /><Card><CardContent className="space-y-4 text-sm">{["2026.05 AX 리더 교육 완료", "2026.02 온라인 1:1 코칭 계약", "2025.11 최초 상담 접수"].map((item) => <div key={item} className="border-l-2 pl-3">{item}</div>)}</CardContent></Card></section></div></>;
}
