import * as React from "react";

import { cn } from "@/lib/utils";

type GlassSurfaceProps = React.ComponentProps<"div"> & {
  strength?: "standard" | "strong" | "data";
};

export function GlassSurface({
  className,
  strength = "standard",
  ...props
}: GlassSurfaceProps) {
  return (
    <div
      data-glass-surface={strength}
      className={cn(
        "glass-surface",
        strength === "strong" && "glass-surface-strong",
        strength === "data" && "glass-surface-data",
        className,
      )}
      {...props}
    />
  );
}
