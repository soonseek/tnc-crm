import type { Metadata, Viewport } from "next";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { MobileShell } from "@/components/mobile-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "트루노스크루 CRM",
  description: "AX 교육·변화관리 영업 자동화 대시보드",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f5f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>
  );
}
