import {
  AlertTriangle,
  CalendarClock,
  Inbox,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";

import { DealCard } from "@/components/deal-card";
import { ScreenHeader } from "@/components/screen-header";
import { ScopeSwitch } from "@/components/scope-switch";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { deals } from "@/lib/mock-data";

const summaries = [
  { label: "기한 초과", value: 3, icon: AlertTriangle, href: "/tasks/overdue" },
  { label: "오늘 할 일", value: 5, icon: CalendarClock, href: "/tasks/today" },
  { label: "신규 접수", value: 2, icon: Inbox, href: "/tasks/new" },
  { label: "위임받은 건", value: 1, icon: UserRoundCheck, href: "/tasks/delegated" },
];

export default function TodayPage() {
  return (
    <>
      <ScreenHeader
        title="오늘 할 일"
        description="8월 19일 수요일 · 김정석 님"
        showSearch
        showAdd
        showEnvironmentLabel
      />
      <div className="space-y-6 px-4 py-5">
        <ScopeSwitch />

        <section className="grid grid-cols-2 gap-3">
          {summaries.map((summary) => {
            const Icon = summary.icon;
            return (
              <Link key={summary.label} href={summary.href}>
                <Card surface="glass" className="gap-3 rounded-2xl py-4 transition-colors hover:bg-muted/30">
                  <CardContent className="flex items-center gap-3 px-4">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{summary.label}</p>
                      <p className="text-xl font-bold">{summary.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="space-y-3">
          <SectionHeading title="먼저 처리하세요" count={2} />
          {deals.slice(0, 2).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </section>

        <section className="space-y-3">
          <SectionHeading
            title="오늘 예정"
            count={2}
            actionHref="/pipeline"
            actionLabel="영업판"
          />
          {deals.slice(2, 4).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </section>
      </div>
    </>
  );
}
