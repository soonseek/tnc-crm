import Link from "next/link";
import {
  Bot,
  Building2,
  CalendarDays,
  ChevronRight,
  FileClock,
  Layers3,
  MousePointerClick,
  Palette,
  Link2,
  ListFilter,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const groups = [
  {
    title: "조회",
    items: [
      { label: "회사", description: "회사별 영업·계약 이력", icon: Building2, href: "/companies" },
      { label: "종료·제외 상담", description: "보류·실패·제외 건 재활성화", icon: ListFilter, href: "/more/excluded" },
      { label: "변경 이력", description: "사용자·AI·자동화 기록", icon: FileClock, href: "/more/audit" },
      { label: "승인 대기", description: "중요 변경 요청 검토", icon: ShieldCheck, href: "/approvals" },
    ],
  },
  {
    title: "관리",
    items: [
      { label: "사용자·권한", description: "관리자, 열람자, AI", icon: Users, href: "/more/users" },
      { label: "휴가·위임", description: "기간과 대체 담당자", icon: CalendarDays, href: "/more/vacations" },
      { label: "AI 서비스 계정", description: "권한과 승인 정책", icon: Bot, href: "/more/ai" },
      { label: "외부 연동", description: "Emergent, Gmail, Webhook", icon: Link2, href: "/more/integrations" },
      { label: "서비스·확률", description: "기본 성공 확률과 서비스", icon: Settings2, href: "/more/services" },
      { label: "안정성", description: "장애 채널과 실패 보관함", icon: ShieldCheck, href: "/more/reliability" },
      { label: "전체 화면 검수", description: "모든 프레임 목업 바로가기", icon: Layers3, href: "/frames" },
      { label: "UI 의사결정", description: "밀도와 상호작용 규칙 검수", icon: MousePointerClick, href: "/ui-decisions" },
      { label: "테마 검수", description: "프로페셔널 코발트 적용 화면", icon: Palette, href: "/theme-preview" },
    ],
  },
];

export default function MorePage() {
  return (
    <>
      <ScreenHeader title="관리" description="운영 기준과 보조 정보" />
      <div className="space-y-6 px-4 py-5">
        {groups.map((group) => (
          <section key={group.title} className="space-y-3">
            <h2 className="font-semibold">{group.title}</h2>
            <Card className="gap-0 py-0">
              <CardContent className="divide-y px-0">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        ))}

        <Button variant="outline" className="w-full">
          로그아웃
        </Button>
      </div>
    </>
  );
}
