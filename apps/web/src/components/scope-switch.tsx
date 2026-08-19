"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScopeSwitch({ className }: { className?: string }) {
  const [scope, setScope] = useState<"mine" | "all">("mine");

  return (
    <div className={cn("glass-segment grid grid-cols-2 rounded-xl bg-muted p-1", className)}>
      <Button
        variant={scope === "mine" ? "outline" : "ghost"}
        size="sm"
        className={scope === "mine" ? "bg-background shadow-sm" : "shadow-none"}
        data-active={scope === "mine"}
        onClick={() => setScope("mine")}
      >
        내 담당
      </Button>
      <Button
        variant={scope === "all" ? "outline" : "ghost"}
        size="sm"
        className={scope === "all" ? "bg-background shadow-sm" : "shadow-none"}
        data-active={scope === "all"}
        onClick={() => setScope("all")}
      >
        전체
      </Button>
    </div>
  );
}
