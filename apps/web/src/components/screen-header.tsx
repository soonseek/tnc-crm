import Link from "next/link";
import { ArrowLeft, Bell, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getDeploymentEnvironment,
  getEnvironmentLabel,
  getEnvironmentLabelClassName,
  getHeaderAddButtonClassName,
} from "@/lib/deployment-environment";

type ScreenHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  showSearch?: boolean;
  showAdd?: boolean;
  showEnvironmentLabel?: boolean;
};

export function ScreenHeader({
  title,
  description,
  backHref,
  showSearch = false,
  showAdd = false,
  showEnvironmentLabel = false,
}: ScreenHeaderProps) {
  const deploymentEnvironment = getDeploymentEnvironment();

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
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="min-w-0 truncate text-lg font-bold tracking-tight">{title}</h1>
            {showEnvironmentLabel ? (
              <Badge
                className={getEnvironmentLabelClassName(deploymentEnvironment)}
                data-environment-label
                data-deployment-environment={deploymentEnvironment}
              >
                {getEnvironmentLabel(deploymentEnvironment)}
              </Badge>
            ) : null}
          </div>
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
            <Button
              asChild
              size="icon-sm"
              className={getHeaderAddButtonClassName(deploymentEnvironment)}
              aria-label="영업 건 추가"
            >
              <Link
                href="/deals/new"
                data-deployment-environment={deploymentEnvironment}
              >
                <Plus />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
