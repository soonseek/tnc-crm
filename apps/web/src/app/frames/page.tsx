import Link from "next/link";
import { CheckCircle2, ChevronRight, Layers3 } from "lucide-react";

import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { frameRoutes, frameSections } from "@/lib/frame-routes";

export default function FramesPage() {
  return (
    <>
      <ScreenHeader title="전체 화면 검수" description={`프레임 목업 ${frameRoutes.length}개`} backHref="/more" />
      <div className="space-y-6 px-4 py-5">
        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <Layers3 className="mt-1 size-5 shrink-0" />
            화면을 순서대로 열어 정보 범위와 업무 흐름을 검수합니다. 시각 테마는 아직 shadcn 기본값입니다.
          </CardContent>
        </Card>
        {frameSections.map((section) => {
          const routes = frameRoutes.filter((route) => route.section === section);
          return (
            <section key={section} className="space-y-3">
              <div className="flex items-center justify-between"><h2 className="font-semibold">{section}</h2><Badge variant="outline">{routes.length}개</Badge></div>
              <Card className="gap-0 py-0">
                <CardContent className="divide-y px-0">
                  {routes.map((route) => (
                    <Link key={route.path} href={route.path} className="flex items-start gap-3 px-4 py-4">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1"><p className="text-sm font-medium">{route.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{route.goal}</p></div>
                      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </>
  );
}
