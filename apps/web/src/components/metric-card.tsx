import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  note?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card surface="glass" className={cn("gap-3 rounded-2xl py-4", className)}>
      <CardContent className="px-4">
        <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4" />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
        {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
      </CardContent>
    </Card>
  );
}
