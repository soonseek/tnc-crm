import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Check, ExternalLink, FileText, Phone, Plus, Save, Send, UserRoundCog } from "lucide-react";

import { FirstContactForm } from "@/components/first-contact-form";
import { FrameField, FrameSelect } from "@/components/frame-field";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getDeal } from "@/lib/crm-api";
import { deals } from "@/lib/mock-data";

const actions = {
  edit: { title: "영업 정보 수정", description: "고객·문의 정보 최신화" },
  activity: { title: "활동 기록", description: "전화·문자·미팅 결과" },
  "next-action": { title: "다음 행동 추가", description: "담당자와 실행 기한 지정" },
  delegate: { title: "담당자 위임", description: "영업 맥락과 함께 전달" },
  status: { title: "상태 변경", description: "큰 단계와 세부 상태" },
  services: { title: "서비스·추산 가치", description: "서비스별 기회 금액" },
  documents: { title: "문서 관리", description: "Google Drive 링크" },
  history: { title: "변경 이력", description: "전체 수정자와 변경 전후" },
} as const;

export function generateStaticParams() {
  return deals.flatMap((deal) => Object.keys(actions).map((action) => ({ id: deal.id, action })));
}

export default async function DealActionPage({ params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  const mockDeal = deals.find((item) => item.id === id);
  const apiDeal = /^[0-9a-f-]{36}$/i.test(id) ? await getDeal(id) : null;
  const deal = mockDeal ?? (apiDeal ? {
    id: apiDeal.id,
    company: apiDeal.companyName,
    contact: [apiDeal.contactName, apiDeal.contactTitle].filter(Boolean).join(" "),
    initialRequest: apiDeal.customerNote || "초기 요청 메모 없음",
    status: apiDeal.status === "unreviewed" ? "미확인" : apiDeal.status === "customer_response_pending" ? "고객 응답 대기" : "초기 상담 완료",
    stage: apiDeal.stage === "new" ? "신규" : "초기 상담",
    service: "등록 서비스",
    due: new Date(apiDeal.contactDeadlineAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }),
    value: "미입력",
    probability: apiDeal.stage === "new" ? 0 : 5,
  } : null);
  const config = actions[action as keyof typeof actions];
  if (!deal || !config) notFound();

  return (
    <>
      <ScreenHeader title={config.title} description={`${deal.company} · ${config.description}`} backHref={`/deals/${deal.id}`} />
      <div className="space-y-5 px-4 py-5">
        <Card className="py-4">
          <CardContent className="space-y-2 px-4">
            <div className="flex flex-wrap gap-2"><Badge>{deal.stage}</Badge><Badge variant="secondary">{deal.status}</Badge></div>
            <p className="font-semibold">{deal.company} · {deal.contact}</p>
            <p className="text-sm leading-6 text-muted-foreground">{deal.initialRequest}</p>
          </CardContent>
        </Card>
        <DealActionContent action={action as keyof typeof actions} deal={deal} isLive={Boolean(apiDeal)} />
      </div>
    </>
  );
}

function DealActionContent({ action, deal, isLive }: { action: keyof typeof actions; deal: (typeof deals)[number]; isLive: boolean }) {
  if (action === "edit") {
    return <><Card><CardHeader><CardTitle>고객·문의 정보</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="회사명" required><Input defaultValue={deal.company} /></FrameField><FrameField label="담당자명·직함" required><Input defaultValue={deal.contact} /></FrameField><div className="grid grid-cols-2 gap-3"><FrameField label="연락처"><Input defaultValue="010-1234-5678" /></FrameField><FrameField label="이메일"><Input defaultValue="hr@sample.co.kr" /></FrameField></div><FrameField label="초기 요청 원문"><Textarea defaultValue={deal.initialRequest} /></FrameField><FrameField label="상담 요약"><Textarea defaultValue="리더 대상 AX 교육과 후속 변화관리 도입 검토" /></FrameField><FrameField label="비고"><Textarea placeholder="내부 공유 메모" /></FrameField></CardContent></Card><Button className="w-full"><Save /> 변경 저장</Button></>;
  }
  if (action === "activity") {
    if (isLive) return <FirstContactForm dealId={deal.id} />;
    return <><Card><CardHeader><CardTitle>활동 결과</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="활동 유형" required><div className="grid grid-cols-3 gap-2"><Button variant="outline"><Phone /> 전화</Button><Button variant="outline"><Send /> 문자</Button><Button variant="outline"><CalendarDays /> 미팅</Button></div></FrameField><FrameField label="통화 결과"><FrameSelect value="통화 연결" /></FrameField><FrameField label="활동 시각"><FrameSelect value="8월 19일 오후 2:20" /></FrameField><FrameField label="상담 내용" required><Textarea defaultValue="전사 리더 대상 교육 목적과 참여 인원을 확인함." /></FrameField><FrameField label="완료 후 상태"><FrameSelect value="초기 상담 완료" /></FrameField></CardContent></Card><div className="grid grid-cols-2 gap-3"><Button asChild variant="outline"><Link href={`/deals/${deal.id}/next-action`}>저장 후 행동 추가</Link></Button><Button><Check /> 활동 저장</Button></div></>;
  }
  if (action === "next-action") {
    return <><Card><CardHeader><CardTitle>실행할 행동</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="행동 유형" required><FrameSelect value="대면·화상 미팅" /></FrameField><FrameField label="행동 제목" required><Input defaultValue="실무 담당자 요구사항 미팅" /></FrameField><div className="grid grid-cols-2 gap-3"><FrameField label="예정일"><FrameSelect value="8월 22일" /></FrameField><FrameField label="시간"><FrameSelect value="오후 2:00" /></FrameField></div><FrameField label="담당자"><FrameSelect value="김정석" /></FrameField><FrameField label="메모"><Textarea placeholder="미팅 전 확인할 내용을 기록하세요." /></FrameField><FrameField label="알림"><FrameSelect value="당일 오전 9시 + 지연 시 매일" /></FrameField></CardContent></Card><Button className="w-full"><Plus /> 다음 행동 등록</Button></>;
  }
  if (action === "delegate") {
    return <><Card><CardHeader><CardTitle>담당자 변경</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="현재 담당자" value="김정석 · 관리자" /><FrameField label="새 담당자" required><FrameSelect value="대표님 · 관리자" /></FrameField><FrameField label="연락 기한" value={deal.due} helper="위임 후에도 유지" /><FrameField label="전달할 맥락" required><Textarea defaultValue={`${deal.initialRequest}\n현재 ${deal.status} 상태입니다.`} /></FrameField><FrameField label="통보 방식" value="카카오톡 연락처 전달 + 전화 상담 내용 전달" /></CardContent></Card><Button className="w-full"><UserRoundCog /> 담당자 위임</Button></>;
  }
  if (action === "status") {
    return <><Card><CardHeader><CardTitle>영업 상태</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="현재 상태" value={`${deal.stage} · ${deal.status}`} /><FrameField label="변경할 큰 단계" required><FrameSelect value="초기 상담" /></FrameField><FrameField label="변경할 세부 상태" required><FrameSelect value="초기 상담 완료" /></FrameField><FrameField label="변경 사유"><Textarea placeholder="상태 변경 배경을 기록하세요." /></FrameField><div className="rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">장기 보류·계약 실패·상담 대상 제외를 선택하면 사유 입력과 재활성화 경로가 함께 저장됩니다.</div></CardContent></Card><Button className="w-full"><Save /> 상태 변경</Button></>;
  }
  if (action === "services") {
    return <><Card><CardHeader><CardTitle>관심 서비스</CardTitle></CardHeader><CardContent className="space-y-4">{[["집합교육", "18,000,000원"], ["3개월 변화관리", "32,000,000원"]].map(([service, value]) => <div key={service} className="space-y-3 rounded-lg border p-3"><div className="flex items-center justify-between"><p className="font-medium">{service}</p><Badge variant="secondary">선택됨</Badge></div><FrameField label="추산 가치"><Input defaultValue={value} /></FrameField></div>)}<Button variant="outline" className="w-full"><Plus /> 서비스 추가</Button><Separator /><FrameField label="전체 추산 가치" value="50,000,000원" /><FrameField label="성공 확률"><FrameSelect value={`${deal.probability}% · 단계 기본값`} /></FrameField><FrameField label="예상 계약 월"><FrameSelect value="2026년 9월" /></FrameField></CardContent></Card><Button className="w-full"><Save /> 금액 저장</Button></>;
  }
  if (action === "documents") {
    return <><Card><CardHeader><CardTitle>연결된 문서</CardTitle></CardHeader><CardContent className="space-y-3">{[["견적서", "AX_리더교육_견적_v2"], ["제안서", "한빛모빌리티_AX교육_제안"], ["계약서", "작성 전"]].map(([type, name]) => <div key={type} className="flex items-center gap-3 rounded-lg border p-3"><FileText className="size-5 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{type}</p><p className="truncate text-sm font-medium">{name}</p></div><Button variant="ghost" size="icon-sm" aria-label={`${type} 열기`}><ExternalLink /></Button></div>)}<Button variant="outline" className="w-full"><Plus /> Drive 링크 추가</Button></CardContent></Card><Card><CardHeader><CardTitle>문서 링크 추가</CardTitle></CardHeader><CardContent className="space-y-4"><FrameField label="문서 유형"><FrameSelect value="견적서" /></FrameField><FrameField label="Google Drive URL"><Input placeholder="https://drive.google.com/..." /></FrameField><FrameField label="표시 이름"><Input placeholder="문서 이름" /></FrameField></CardContent></Card><Button className="w-full"><Save /> 문서 저장</Button></>;
  }
  return <Card><CardHeader><div className="flex items-center justify-between"><CardTitle>전체 변경 기록</CardTitle><Button variant="outline" size="sm">필터</Button></div></CardHeader><CardContent className="space-y-5">{[["상태 변경", "1차 연락 대기 → 초기 상담 완료", "김정석 · 오늘 오후 2:24"], ["활동 추가", "배경 확인 전화 · 통화 연결", "김정석 · 오늘 오후 2:20"], ["담당자 지정", "미배정 → 김정석", "시스템 · 오늘 오전 11:40"], ["상담 접수", "Emergent 원본 ID #EM-2841", "시스템 · 오늘 오전 11:40"]].map(([title, detail, meta]) => <div key={title} className="relative border-l pl-4"><span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-background bg-foreground" /><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm">{detail}</p><p className="mt-1 text-xs text-muted-foreground">{meta}</p></div>)}</CardContent></Card>;
}
