"use client";

import { Icon } from "@iconify/react";
import { useState, useSyncExternalStore } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { AppBottomNav } from "@/src/shared/components/navigation";
import { BottomSheet } from "@/src/shared/components/overlays";
import { getDashboardNavItems } from "@/src/features/dashboard/lib/navigation";
import {
  readOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

const trendPoints = [
  "10,56 32,52 54,34 76,30 98,42 120,54 142,46 164,32 186,26 208,30 230,38 252,44 270,41",
];

const transactions = [
  {
    amount: "+Rp 285.000",
    meta: "Hari ini, 14:22",
    icon: "solar:scooter-bold-duotone",
    source: "Gojek - Ojol",
  },
  {
    amount: "+Rp 310.000",
    meta: "Kemarin, 19:05",
    icon: "solar:scooter-bold-duotone",
    source: "Gojek - Ojol",
  },
  {
    amount: "+Rp 195.000",
    icon: "solar:pen-2-bold-duotone",
    meta: "27 Jun, 10:11",
    source: "Manual - Grab",
  },
];

const sourceOptions = ["Gojek - GoPay", "OVO - Kurir Online", "Input Manual"];

function IncomeEntrySheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSource] = useState(sourceOptions[0]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-4 px-5 pb-[calc(1.1rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-secondary/10" />

        <div className="flex items-center justify-between gap-4">
          <div className="grid gap-0.5">
            <p className="text-[11px] font-medium text-secondary/30">
              Entri cepat
            </p>
            <h2 className="text-[1.45rem] font-bold tracking-[-0.04em] text-secondary">
              Catat Penghasilan
            </h2>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/6 text-secondary/65"
            onClick={onClose}
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:close-circle-linear" />
          </button>
        </div>

        <section className="rounded-[22px] border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] px-4 py-3.5 text-center shadow-[0_12px_28px_rgba(48,102,190,0.06)]">
          <p className="text-sm font-medium text-secondary/32">Nominal Penghasilan</p>
          <h3 className="mt-1 text-[2.55rem] font-bold leading-none tracking-[-0.07em] text-secondary">
            Rp 285.000
          </h3>
          <span className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Siap dicatat ke ledger
          </span>
        </section>

        <div className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-secondary">Sumber Penghasilan</span>
            <button
              className="flex min-h-[58px] items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 text-left shadow-[0_6px_18px_rgba(23,23,56,0.03)]"
              type="button"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" icon="solar:map-point-bold-duotone" />
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {selectedSource}
                </span>
              </span>
              <Icon className="h-4 w-4 text-secondary/35" icon="solar:alt-arrow-down-linear" />
            </button>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-secondary">Tanggal</span>
            <button
              className="flex min-h-[58px] items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 text-left shadow-[0_6px_18px_rgba(23,23,56,0.03)]"
              type="button"
            >
              <span className="text-sm font-medium text-secondary">
                Hari ini - Senin, 29 Jun 2026
              </span>
              <Icon className="h-4 w-4 text-secondary/35" icon="solar:calendar-linear" />
            </button>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-secondary">
              Deskripsi <span className="font-medium text-secondary/35">(Opsional)</span>
            </span>
            <input
              className="min-h-[58px] rounded-[18px] border border-black/10 bg-white px-4 text-sm font-medium text-secondary outline-none shadow-[0_6px_18px_rgba(23,23,56,0.03)] placeholder:text-secondary/28"
              placeholder="Tambahkan catatan..."
            />
          </label>
        </div>

        <div className="grid gap-2 border-t border-black/6 pt-3.5">
          <PressButton className="min-h-[58px] w-full justify-center text-base" variant="primary">
            Simpan ke Ledger
          </PressButton>
          <p className="text-center text-xs leading-5 text-secondary/32">
            Entri akan diverifikasi dan diamankan dengan SHA-256
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

export function DashboardHomeView() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const draft = readOnboardingDraft();
  const displayName = draft.fullName || "Rudi";

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[29rem] flex-col px-3 pb-28 pt-2">
        <header className="flex items-start justify-between gap-4 px-2 pb-3 pt-1.5">
          <div className="grid gap-0.5">
            <p className="text-[11px] font-medium text-secondary/32">
              Senin, 29 Juni 2026
            </p>
            <h1 className="text-[1.7rem] font-bold leading-none tracking-[-0.05em] text-secondary">
              Halo, {displayName}
            </h1>
          </div>

          <button
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white text-secondary shadow-[0_8px_20px_rgba(23,23,56,0.06)]"
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:bell-bing-bold-duotone" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary" />
          </button>
        </header>

        <section className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_26%),linear-gradient(145deg,#4478d0_0%,#3c70ca_48%,#2858af_100%)] px-4 py-4 text-white shadow-[0_14px_34px_rgba(48,102,190,0.24)]">
          <p className="text-[11px] font-semibold tracking-[-0.01em] text-white/72">
            Estimasi gaji bulan ini
          </p>
          <h2 className="mt-1.5 text-[2.45rem] font-bold leading-none tracking-[-0.07em]">
            Rp 6.850.000
          </h2>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-semibold">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-emerald-200">
              <span className="rounded-full bg-emerald-400/16 px-1.5 py-0.5 text-[9px] text-emerald-100">
                +12%
              </span>
              <span className="text-white/76">vs bulan lalu</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              <span className="text-[9px] text-emerald-100">
                Risiko rendah
              </span>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-3 border-t border-white/10 pt-3.5">
            <div>
              <p className="text-[10px] text-white/46">Hari ini</p>
              <p className="mt-1 text-[0.96rem] font-semibold">Rp 285.000</p>
            </div>
            <div>
              <p className="text-[10px] text-white/46">63 entri</p>
              <p className="mt-1 text-[0.96rem] font-semibold">Rantai Valid</p>
            </div>
            <div>
              <p className="text-[10px] text-white/46">Model</p>
              <p className="mt-1 text-[0.96rem] font-semibold">Prophet ML</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-[1fr_auto] gap-3 pt-3">
          <PressButton
            className="min-h-14 w-full justify-center gap-2 bg-tertiary text-base font-bold text-secondary hover:bg-tertiary/96"
            onClick={() => setIsSheetOpen(true)}
            variant="secondary"
          >
            <Icon className="h-5 w-5" icon="solar:add-circle-bold" />
            Catat Penghasilan
          </PressButton>
          <button
            className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] border border-black/8 bg-white text-secondary shadow-[0_10px_22px_rgba(23,23,56,0.05)]"
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:calendar-mark-bold-duotone" />
          </button>
        </div>

        <section className="mt-3 rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-secondary">Tren 30 Hari Terakhir</h3>
            </div>
            <span className="text-[11px] font-medium text-secondary/35">Jun 2026</span>
          </div>
          <svg
            className="mt-2 h-[72px] w-full"
            fill="none"
            viewBox="0 0 280 90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={trendPoints[0]}
              stroke="rgba(48,102,190,0.22)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            />
            <path
              d={trendPoints[0]}
              stroke="var(--color-primary)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </section>

        <section className="mt-3 rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
          <div className="pb-1">
            <h3 className="text-sm font-semibold text-secondary">Transaksi Terbaru</h3>
          </div>
          <div className="grid">
            {transactions.map((transaction) => (
              <article
                className="flex items-center justify-between gap-3 border-t border-black/6 py-3.5 first:border-t-0"
                key={`${transaction.source}-${transaction.amount}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecf5ff] text-primary">
                    <Icon className="h-4 w-4" icon={transaction.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-secondary">
                      {transaction.source}
                    </p>
                    <p className="truncate text-[11px] font-medium text-secondary/30">
                      {transaction.meta}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary">{transaction.amount}</p>
                  <p className="text-[10px] font-medium tracking-[0.06em] text-secondary/22">
                    c1a97d2...
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <AppBottomNav items={getDashboardNavItems("home")} />

      <IncomeEntrySheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
