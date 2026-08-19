import { Save } from "lucide-react";

import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContractEditPage() {
  return <><ScreenHeader title="계약 수정" description="다원그룹 · 변경 이력 보존" backHref="/contracts/dawon-group" /><div className="space-y-5 px-4 py-5"><Card><CardHeader><CardTitle>계약 정보</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="계약 체결일"><FrameSelect value="2026년 8월 18일" /></FrameField><FrameField label="집합교육 계약 금액"><Input defaultValue="36,000,000" /></FrameField><FrameField label="3개월 변화관리 계약 금액"><Input defaultValue="20,000,000" /></FrameField><FrameField label="총 계약 금액" value="56,000,000원 · VAT 포함" /><FrameField label="수정 사유" required><Textarea placeholder="감사 기록에 남길 사유를 입력하세요." /></FrameField></CardContent></Card><Button className="w-full"><Save /> 계약 변경 저장</Button></div></>;
}
