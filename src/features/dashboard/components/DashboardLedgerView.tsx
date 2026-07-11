"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { useDashboardLedgerData } from "@/src/features/dashboard/hooks/useDashboardLedgerData";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardScreenSkeleton } from "./DashboardScreenSkeleton";
import { LedgerSourceFilterSheet } from "./LedgerSourceFilterSheet";

export function DashboardLedgerView() {
  const isHydrated = useDashboardHydrated();
  const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
  const {
    data,
    error,
    isLoading,
    selectedPeriod,
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
  const selectedSource = safeData.sourceOptions.find(
    (source) => source.id === selectedSourceId,
  );

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
          <div className="grid grid-cols-3 rounded-[18px] bg-secondary/[0.045] p-1">
            {safeData.filters.map((filter) => (
              <button
                aria-pressed={filter.id === selectedPeriod}
                className={`min-h-10 rounded-[14px] px-2 text-sm font-semibold transition-colors ${
                  filter.id === selectedPeriod
                    ? "bg-secondary text-white"
                    : "text-secondary/48 hover:text-secondary/70"
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

        <section className="px-1 pt-3">
          <p className="mb-1.5 px-1 text-[11px] font-semibold text-secondary/42">
            Sumber penghasilan
          </p>
          <button
            aria-expanded={isSourceFilterOpen}
            aria-haspopup="dialog"
            className="flex min-h-13 w-full items-center gap-3 rounded-[17px] border border-black/10 bg-white px-3.5 text-left transition-colors hover:border-primary/25"
            onClick={() => setIsSourceFilterOpen(true)}
            type="button"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              <Icon
                className="h-[18px] w-[18px]"
                icon={selectedSource?.icon || "solar:wallet-money-bold"}
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-secondary">
              {selectedSource?.label || "Semua sumber"}
            </span>
            <Icon className="h-5 w-5 shrink-0 text-secondary/35" icon="solar:alt-arrow-down-linear" />
          </button>
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

      <LedgerSourceFilterSheet
        isOpen={isSourceFilterOpen}
        onClose={() => setIsSourceFilterOpen(false)}
        onSelect={setSelectedSourceId}
        options={safeData.sourceOptions}
        selectedSourceId={selectedSourceId}
      />
    </>
  );
}
