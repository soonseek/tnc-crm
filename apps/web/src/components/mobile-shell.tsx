"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Columns3,
  ListTodo,
  ReceiptText,
  Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "할 일", icon: ListTodo },
  { href: "/pipeline", label: "영업판", icon: Columns3 },
  { href: "/billing", label: "계약·청구", icon: ReceiptText },
  { href: "/performance", label: "성과", icon: BarChart3 },
  { href: "/more", label: "관리", icon: Settings2 },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/tasks") || pathname.startsWith("/deals");
  }
  if (href === "/billing") {
    return pathname.startsWith("/billing") || pathname.startsWith("/contracts") || pathname.startsWith("/invoices");
  }
  if (href === "/more") {
    return pathname.startsWith("/more") || pathname.startsWith("/approvals") || pathname.startsWith("/frames") || pathname.startsWith("/ui-decisions") || pathname.startsWith("/theme-preview");
  }
  return pathname.startsWith(href);
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccessScreen = pathname === "/login";

  return (
    <div className="theme-professional-cobalt theme-restrained-glass min-h-svh bg-muted/40 frame-grid">
      <div className="app-viewport relative mx-auto min-h-svh max-w-md bg-background shadow-xl shadow-black/5">
        <main className={isAccessScreen ? "min-h-svh" : "min-h-svh pb-24"}>{children}</main>
        {isAccessScreen ? null : <nav data-shell-navigation className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-md grid-cols-5 border-t bg-background/95 px-2 pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] text-muted-foreground transition-colors",
                  active && "bg-accent font-semibold text-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>}
      </div>
    </div>
  );
}
