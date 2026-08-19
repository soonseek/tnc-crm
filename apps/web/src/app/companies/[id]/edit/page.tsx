import { notFound } from "next/navigation";
import { Save } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deals } from "@/lib/mock-data";

export default async function CompanyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const deal = deals.find((item) => item.id === id); if (!deal) notFound();
  return <><ScreenHeader title="회사 정보 수정" description={deal.company} backHref={`/companies/${id}`} /><div className="space-y-5 px-4 py-5"><Card><CardHeader><CardTitle>기본 정보</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="회사명" required><Input defaultValue={deal.company} /></FrameField><FrameField label="회사 규모"><FrameSelect value="201~500명" /></FrameField><FrameField label="PM"><FrameSelect value="김정석" /></FrameField><FrameField label="투입 인력"><FrameSelect value="김정석, 대표님, 외부 퍼실리테이터" /></FrameField><FrameField label="회사 식별 기준" value="회사명" helper="현재 중복 없음" /></CardContent></Card><Button className="w-full"><Save /> 회사 정보 저장</Button></div></>;
}
