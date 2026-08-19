import Link from "next/link";
import { AlertTriangle, Bot, CalendarClock, ChevronRight, ReceiptText } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  { title: "1차 연락 기한이 지났습니다", meta: "세움테크 · 1일 지연", href: "/deals/seum-tech", icon: AlertTriangle, unread: true },
  { title: "계산서 발행 예정 D-3", meta: "다원그룹 · 선금 1,680만원", href: "/contracts/dawon-group", icon: ReceiptText, unread: true },
  { title: "AI 변경 승인이 필요합니다", meta: "계산서 발행일 변경 · 1건", href: "/approvals/approval-1", icon: Bot, unread: true },
  { title: "오늘 예정된 후속 연락", meta: "그린웨이브 · 오후 4:00", href: "/tasks/today", icon: CalendarClock, unread: false },
];

export default function NotificationsPage() {
  return (
    <>
      <ScreenHeader title="알림" description="업무·승인·시스템 알림" backHref="/" />
      <div className="space-y-4 px-4 py-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">새 알림 3개</span>
          <button className="text-xs text-muted-foreground">모두 읽음</button>
        </div>
        <Card className="gap-0 py-0">
          <CardContent className="divide-y px-0">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="flex items-start gap-3 px-4 py-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted"><Icon className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.unread ? <Badge variant="secondary" className="px-1.5">새 알림</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <ChevronRight className="mt-2 size-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
