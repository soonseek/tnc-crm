import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="text-xl font-bold">영업 건을 찾을 수 없습니다</h1>
      <Button asChild>
        <Link href="/">할 일로 돌아가기</Link>
      </Button>
    </div>
  );
}

