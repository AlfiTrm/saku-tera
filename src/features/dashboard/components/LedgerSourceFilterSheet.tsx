"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { BottomSheet } from "@/src/shared/components/overlays";
import type { DashboardLedgerData } from "@/src/features/dashboard/types/dashboardData";

type LedgerSourceOption = DashboardLedgerData["sourceOptions"][number];

type LedgerSourceFilterSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sourceId: string) => void;
  options: LedgerSourceOption[];
  selectedSourceId: string;
};

export function LedgerSourceFilterSheet({
  isOpen,
  onClose,
  onSelect,
  options,
  selectedSourceId,
}: LedgerSourceFilterSheetProps) {
  const [query, setQuery] = useState("");
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLocaleLowerCase("id").includes(normalizedQuery),
    );
  }, [options, query]);

  function closeSheet() {
    setQuery("");
    onClose();
  }

  function selectSource(sourceId: string) {
    onSelect(sourceId);
    closeSheet();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={closeSheet}>
      <div className="flex max-h-[78dvh] flex-col px-5 pb-[calc(1.2rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-secondary/10" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-secondary">
              Pilih sumber
            </h2>
            <p className="mt-1 text-sm text-secondary/45">
              Tampilkan transaksi dari sumber tertentu.
            </p>
          </div>
          <button
            aria-label="Tutup pilihan sumber"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary/55 hover:bg-secondary/5"
            onClick={closeSheet}
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:close-circle-linear" />
          </button>
        </div>

        <label className="mt-4 flex min-h-12 items-center gap-2 rounded-[16px] border border-black/8 bg-white px-3 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
          <Icon className="h-5 w-5 shrink-0 text-secondary/35" icon="solar:magnifer-linear" />
          <input
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-secondary/35"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari sumber penghasilan..."
            value={query}
          />
        </label>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!query.trim() ? (
            <button
              aria-pressed={!selectedSourceId}
              className={`flex min-h-14 w-full items-center gap-3 rounded-[16px] px-3 text-left transition-colors ${
                !selectedSourceId ? "bg-primary/8 text-secondary" : "text-secondary/68 hover:bg-secondary/[0.035]"
              }`}
              onClick={() => selectSource("")}
              type="button"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" icon="solar:wallet-money-bold" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">Semua sumber</span>
              <Icon
                className={`h-5 w-5 text-primary ${!selectedSourceId ? "opacity-100" : "opacity-0"}`}
                icon="solar:check-circle-bold"
              />
            </button>
          ) : null}

          {filteredOptions.map((option) => {
            const isSelected = option.id === selectedSourceId;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex min-h-14 w-full items-center gap-3 rounded-[16px] px-3 text-left transition-colors ${
                  isSelected ? "bg-primary/8 text-secondary" : "text-secondary/68 hover:bg-secondary/[0.035]"
                }`}
                key={option.id}
                onClick={() => selectSource(option.id)}
                type="button"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" icon={option.icon} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {option.label}
                </span>
                <Icon
                  className={`h-5 w-5 text-primary ${isSelected ? "opacity-100" : "opacity-0"}`}
                  icon="solar:check-circle-bold"
                />
              </button>
            );
          })}

          {query.trim() && filteredOptions.length === 0 ? (
            <div className="grid justify-items-center gap-2 py-8 text-center">
              <Icon className="h-7 w-7 text-secondary/25" icon="solar:magnifer-linear" />
              <p className="text-sm font-medium text-secondary/42">
                Sumber tidak ditemukan.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </BottomSheet>
  );
}
