import Link from "next/link";
import { ArrowLeft, Bell, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type ScreenHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  showSearch?: boolean;
  showAdd?: boolean;
};

export function ScreenHeader({
  title,
  description,
  backHref,
  showSearch = false,
  showAdd = false,
}: ScreenHeaderProps) {
  return (
    <header data-screen-header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Button asChild variant="ghost" size="icon-sm" aria-label="뒤로">
            <Link href={backHref}>
              <ArrowLeft />
            </Link>
          </Button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {showSearch ? (
            <Button asChild variant="ghost" size="icon-sm" aria-label="회사 검색">
              <Link href="/companies">
                <Search />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="icon-sm" aria-label="알림">
            <Link href="/notifications">
              <Bell />
            </Link>
          </Button>
          {showAdd ? (
            <Button asChild size="icon-sm" aria-label="영업 건 추가">
              <Link href="/deals/new">
                <Plus />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
