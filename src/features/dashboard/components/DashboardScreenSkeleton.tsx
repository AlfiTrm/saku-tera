"use client";

import { Skeleton } from "@/src/shared/components/feedback";

export function DashboardScreenSkeleton() {
  return (
    <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col px-3 pb-28 pt-3">
      <div className="grid gap-2 px-2 pb-4">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-9 w-40 rounded-2xl" />
      </div>

      <Skeleton className="h-60 rounded-[24px]" />
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
        <Skeleton className="h-14 rounded-[18px]" />
        <Skeleton className="h-14 w-14 rounded-[18px]" />
      </div>
      <Skeleton className="mt-3 h-40 rounded-[20px]" />
      <Skeleton className="mt-3 h-52 rounded-[20px]" />
    </main>
  );
}
