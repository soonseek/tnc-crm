import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeading({
  title,
  count,
  actionHref,
  actionLabel = "전체",
}: {
  title: string;
  count?: number;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-2">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        {typeof count === "number" ? (
          <span className="text-sm text-muted-foreground">{count}</span>
        ) : null}
      </div>
      {actionHref ? (
        <Link
          href={actionHref}
          className="flex items-center text-xs font-medium text-muted-foreground"
        >
          {actionLabel}
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

