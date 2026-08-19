import Link from "next/link";
import { Plus, Save } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NewContractPage() {
  return <><ScreenHeader title="계약 등록" description="서비스별 금액과 청구 계획" backHref="/billing" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><CardTitle>계약 기본 정보</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="연결할 영업 건" required><FrameSelect value="다원그룹 · 계약서 서명 완료" /></FrameField><FrameField label="계약 체결일"><FrameSelect value="2026년 8월 18일" /></FrameField><FrameField label="계약서"><FrameSelect value="Google Drive 링크 선택" /></FrameField></CardContent></Card><Card><CardHeader><CardTitle>서비스별 계약 금액</CardTitle></CardHeader><CardContent className="space-y-4">{([["집합교육", "36,000,000"], ["3개월 변화관리", "20,000,000"]] as const).map(([service, amount]) => <div key={service} className="space-y-3 rounded-lg border p-3"><FrameField label="서비스"><FrameSelect value={service} /></FrameField><FrameField label="계약 금액 · VAT 포함"><Input defaultValue={amount} /></FrameField></div>)}<Button variant="outline" className="w-full"><Plus /> 서비스 추가</Button><FrameField label="총 계약 금액" value="56,000,000원" /></CardContent></Card><div className="grid grid-cols-2 gap-3"><Button variant="outline"><Save /> 임시 저장</Button><Button asChild><Link href="/contracts/dawon-group">계약 등록</Link></Button></div></div></>;
}
