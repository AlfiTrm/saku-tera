"use client";

import { Skeleton } from "@/src/shared/components/feedback";

export function OnboardingScreenSkeleton() {
  return (
    <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col px-5 pb-8 pt-4 text-secondary sm:px-6">
      <div className="grid gap-4">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <div className="grid gap-2">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-5 w-56 rounded-full" />
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-[68px] rounded-[18px]" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-14 rounded-[18px]" />
        </div>
        <Skeleton className="h-28 rounded-[18px]" />
        <Skeleton className="h-14 rounded-[18px]" />
      </div>
    </main>
  );
}
