import type { ReactNode } from "react";

export function FrameField({
  label,
  value,
  helper,
  required = false,
  children,
}: {
  label: string;
  value?: string;
  helper?: string;
  required?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {label} {required ? <span className="text-destructive">*</span> : null}
        </p>
        {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
      </div>
      {children ?? (
        <div className="min-h-10 rounded-md border bg-background px-3 py-2 text-sm shadow-xs">
          {value}
        </div>
      )}
    </div>
  );
}

export function FrameSelect({ value }: { value: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-xs">
      <span>{value}</span>
      <span className="text-xs text-muted-foreground">선택</span>
    </div>
  );
}
