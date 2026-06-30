"use client";

import { Icon } from "@iconify/react";
import { useSyncExternalStore } from "react";
import { AppBottomNav } from "@/src/shared/components/navigation";
import { getDashboardNavItems } from "@/src/features/dashboard/lib/navigation";

function subscribe() {
  return () => undefined;
}

const filters = ["Semua", "Bulan Ini", "3 Bulan", "Gojek"] as const;

const ledgerEntries = [
  {
    amount: "+Rp 285.000",
    hash: "a37fb2cd1ed4f9a0b62cd3e1...",
    icon: "solar:scooter-bold-duotone",
    meta: "29 Jun · 14:22 WIB",
    source: "Gojek · Ojol",
  },
  {
    amount: "+Rp 310.000",
    hash: "9e2d4b1ad17e626d2b4a8c1...",
    icon: "solar:scooter-bold-duotone",
    meta: "28 Jun · 19:05 WIB",
    source: "Gojek · Ojol",
  },
  {
    amount: "+Rp 195.000",
    hash: "c1a97d2b50ca84f1e6b3d7...",
    icon: "solar:pen-2-bold-duotone",
    meta: "27 Jun · 20:11 WIB",
    source: "Manual · Grab",
  },
  {
    amount: "+Rp 265.000",
    hash: "4df51cb908cbf17b287e39...",
    icon: "solar:scooter-bold-duotone",
    meta: "26 Jun · 15:45 WIB",
    source: "Gojek · Ojol",
  },
];

export function DashboardLedgerView() {
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[29rem] flex-col px-3 pb-28 pt-3">
        <header className="px-2 pb-3">
          <h1 className="text-[1.65rem] font-bold leading-none tracking-[-0.05em] text-secondary">
            Buku Kas Digital
          </h1>
          <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="inline-flex h-5 w-5 items-center justify-center text-emerald-500">
              <Icon className="h-4 w-4" icon="solar:shield-check-bold" />
            </span>
            <span>63 entri</span>
            <span className="text-emerald-300">/</span>
            <span>Rantai Hash Valid</span>
          </div>
        </header>

        <section className="px-1">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter, index) => {
              const isActive = index === 0;

              return (
                <button
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-secondary bg-secondary text-white shadow-[0_8px_18px_rgba(23,23,56,0.14)]"
                      : "border-black/10 bg-white text-secondary/45"
                  }`}
                  key={filter}
                  type="button"
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          {ledgerEntries.map((entry) => (
            <article
              className="rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]"
              key={`${entry.source}-${entry.amount}-${entry.meta}`}
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

                <div className="text-right">
                  <p className="text-[1rem] font-bold text-secondary">{entry.amount}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-emerald-500">
                    VERIFIED
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-black/6 pt-2.5 text-[10px] font-medium text-secondary/22">
                <Icon className="h-3.5 w-3.5 shrink-0" icon="solar:link-round-angle-linear" />
                <span className="truncate">{entry.hash}</span>
              </div>
            </article>
          ))}
        </section>
      </main>

      <AppBottomNav items={getDashboardNavItems("ledger")} />
    </>
  );
}
