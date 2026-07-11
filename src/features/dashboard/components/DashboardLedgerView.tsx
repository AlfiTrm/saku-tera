"use client";

import { Icon } from "@iconify/react";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { useDashboardLedgerData } from "@/src/features/dashboard/hooks/useDashboardLedgerData";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardScreenSkeleton } from "./DashboardScreenSkeleton";

export function DashboardLedgerView() {
  const isHydrated = useDashboardHydrated();
  const {
    data,
    error,
    isLoading,
    selectedSourceId,
    setSelectedPeriod,
    setSelectedSourceId,
  } = useDashboardLedgerData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }
  const safeData =
    data ??
    ({
      entries: [],
      filters: [
        { active: true, id: "all", label: "Semua" },
        { active: false, id: "bulan_ini", label: "Bulan Ini" },
        { active: false, id: "3_bulan", label: "3 Bulan" },
      ],
      integrityLabel: "Data belum tersedia / Ledger belum terbaca",
      selectedPeriod: "all",
      selectedSourceId: "",
      sourceOptions: [],
    } as const);

  const [integrityCount, integrityStatus] = safeData.integrityLabel.split(" / ");

  return (
    <>
      <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden bg-white px-3 pb-28 pt-2">
        <DashboardPageHeader
          subtitle={
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
              <Icon className="h-4 w-4 text-emerald-500" icon="solar:shield-check-bold" />
              <span>{integrityCount}</span>
              <span className="text-emerald-300">/</span>
              <span>{integrityStatus}</span>
            </span>
          }
          title="Buku Kas Digital"
        />

        <section className="px-1">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {safeData.filters.map((filter) => (
              <button
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  filter.active
                    ? "border-secondary bg-secondary text-white shadow-[0_8px_18px_rgba(23,23,56,0.14)]"
                    : "border-black/10 bg-white text-secondary/45"
                }`}
                key={filter.id}
                onClick={() => setSelectedPeriod(filter.id as "all" | "bulan_ini" | "3_bulan")}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-1 pt-2">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !selectedSourceId
                  ? "border-secondary bg-secondary text-white shadow-[0_8px_18px_rgba(23,23,56,0.14)]"
                  : "border-black/10 bg-white text-secondary/45"
              }`}
              onClick={() => setSelectedSourceId("")}
              type="button"
            >
              Semua sumber
            </button>
            {safeData.sourceOptions.map((source) => (
              <button
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedSourceId === source.id
                    ? "border-secondary bg-secondary text-white shadow-[0_8px_18px_rgba(23,23,56,0.14)]"
                    : "border-black/10 bg-white text-secondary/45"
                }`}
                key={source.id}
                onClick={() => setSelectedSourceId(source.id)}
                type="button"
              >
                {source.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          {safeData.entries.length > 0 ? (
            safeData.entries.map((entry) => (
              <article
                className="rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]"
                key={entry.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecf5ff] text-primary">
                      <Icon className="h-4 w-4" icon={entry.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[1rem] font-semibold text-secondary">
                        {entry.source}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-secondary/35">
                        {entry.meta}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[0.92rem] font-bold text-secondary sm:text-[1rem]">
                      {entry.amount}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-emerald-500">
                      {entry.status === "verified" ? "VERIFIED" : "PENDING"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-black/6 pt-2.5 text-[10px] font-medium text-secondary/22">
                  <Icon className="h-3.5 w-3.5 shrink-0" icon="solar:link-round-angle-linear" />
                  <span className="truncate">{entry.hashPreview}</span>
                </div>
              </article>
            ))
          ) : (
            <DashboardEmptyState
              description={
                error
                  ? error
                  : "Ledger akan terisi begitu kamu mulai mencatat penghasilan."
              }
              icon="solar:clipboard-list-bold-duotone"
              title={error ? "Ledger belum tersedia" : "Ledger masih kosong"}
              tone={error ? "error" : "default"}
            />
          )}
        </section>
      </main>

    </>
  );
}
