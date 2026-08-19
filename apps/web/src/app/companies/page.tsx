import Link from "next/link";
import { Building2, ChevronRight, Search, UserRound } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deals } from "@/lib/mock-data";

export default function CompaniesPage() {
  return (
    <>
      <ScreenHeader title="회사 검색" description="회사별 전체 영업 이력" backHref="/" />
      <div className="space-y-5 px-4 py-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="회사명 검색" />
        </div>

        <div className="space-y-3">
          {deals.map((deal, index) => (
            <Card key={deal.company} className="py-0">
              <CardContent className="flex items-center gap-3 px-4 py-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{deal.company}</p>
                    <Badge variant="outline">{index % 2 === 0 ? "51~200명" : "201~500명"}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <UserRound className="size-3" /> PM 김정석 · 진행 건 {index % 3 + 1}
                  </p>
                </div>
                <Button asChild variant="ghost" size="icon-sm">
                  <Link href={`/companies/${deal.id}`} aria-label={`${deal.company} 보기`}>
                    <ChevronRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
