"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { DashboardEmptyState } from "@/src/features/dashboard/components/DashboardEmptyState";
import { DashboardScreenSkeleton } from "@/src/features/dashboard/components/DashboardScreenSkeleton";
import { PassportHistoryTimelineItem } from "@/src/features/dashboard/components/passport-history/PassportHistoryTimelineItem";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { usePassportHistoryData } from "@/src/features/dashboard/hooks/usePassportHistoryData";

export function PassportHistoryView() {
  const isHydrated = useDashboardHydrated();
  const {
    error,
    filters,
    historyEntries,
    isLoading,
    setSelectedFilter,
  } = usePassportHistoryData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[29rem] flex-col px-3 pb-28 pt-3">
        <header className="px-2 pb-3">
          <Link
            className="mb-2 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-secondary/72"
            href="/dashboard/passport/access"
          >
            <Icon className="h-4 w-4" icon="solar:alt-arrow-left-linear" />
            Kembali
          </Link>
          <h1 className="text-[1.65rem] font-bold leading-none tracking-[-0.05em] text-secondary">
            Riwayat Akses Data
          </h1>
          <p className="mt-1 text-sm font-medium text-secondary/32">
            Siapa yang mengakses Income Passport kamu
          </p>
        </header>

        <section className="px-1">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  filter.active
                    ? "border-secondary bg-secondary text-white shadow-[0_8px_18px_rgba(23,23,56,0.14)]"
                    : "border-black/10 bg-white text-secondary/42"
                }`}
                key={filter.label}
                onClick={() => setSelectedFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {historyEntries.length > 0 ? (
          <section className="mt-4 grid gap-0">
            {historyEntries.map((entry, index) => (
              <PassportHistoryTimelineItem
                entry={entry}
                isLast={index === historyEntries.length - 1}
                key={entry.id}
              />
            ))}
          </section>
        ) : (
          <section className="mt-4">
            <DashboardEmptyState
              description={
                error
                  ? error
                  : "Belum ada riwayat akses yang tercatat untuk filter ini."
              }
              icon="solar:clock-circle-bold-duotone"
              title={error ? "Riwayat belum tersedia" : "Riwayat masih kosong"}
              tone={error ? "error" : "default"}
            />
          </section>
        )}
      </main>

    </>
  );
}
