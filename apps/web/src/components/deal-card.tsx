import Link from "next/link";
import {
  Check,
  ChevronRight,
  Clock3,
  Phone,
  UserRoundCog,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Deal } from "@/lib/mock-data";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card className={deal.urgent ? "border-foreground/35" : undefined}>
      <CardHeader className="min-w-0 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge variant={deal.urgent ? "destructive" : "secondary"}>
                {deal.status}
              </Badge>
              {deal.delegated ? <Badge variant="outline">위임</Badge> : null}
            </div>
            <CardTitle className="text-base">{deal.company}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{deal.contact}</p>
            <p
              className="mt-2 truncate text-sm"
              title={deal.initialRequest}
              aria-label={`초기 요청: ${deal.initialRequest}`}
            >
              <span className="text-muted-foreground">초기 요청 · </span>
              {deal.initialRequest}
            </p>
          </div>
          <Button asChild variant="ghost" size="icon-sm" aria-label="상세 보기">
            <Link href={`/deals/${deal.id}`}>
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">다음 기한</p>
            <p className="mt-1 flex items-center gap-1 font-semibold">
              <Clock3 className="size-3.5" />
              {deal.due}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">서비스 · 추산</p>
            <p className="mt-1 truncate font-semibold">{deal.service}</p>
            <p className="mt-0.5 text-muted-foreground">{deal.value}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="tel:01012345678">
              <Phone /> 전화
            </a>
          </Button>
          <Button variant="outline" size="sm">
            <Check /> 완료
          </Button>
          <Button variant="outline" size="sm">
            <UserRoundCog /> 위임
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
