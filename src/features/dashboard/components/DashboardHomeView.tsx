"use client";

import { Icon } from "@iconify/react";
import { Popover } from "radix-ui";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { AppBottomNav } from "@/src/shared/components/navigation";
import { useDashboardHomeData } from "@/src/features/dashboard/hooks/useDashboardHomeData";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { getDashboardNavItems } from "@/src/features/dashboard/lib/navigation";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardLineChart } from "./DashboardLineChart";
import { DashboardScreenSkeleton } from "./DashboardScreenSkeleton";

function DashboardInsightInfo({ copy }: { copy: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label="Lihat detail estimasi"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/58 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/45"
          type="button"
        >
          <Icon className="h-4 w-4" icon="solar:question-circle-linear" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          className="z-[80] w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-black/8 bg-white px-4 py-3 text-secondary shadow-[0_16px_44px_rgba(23,23,56,0.18)] outline-none"
          collisionPadding={12}
          sideOffset={8}
        >
          <p className="text-xs font-semibold text-secondary">Tentang estimasi</p>
          <p className="mt-1 text-xs leading-5 text-secondary/62">{copy}</p>
          <Popover.Arrow className="fill-white" height={6} width={12} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function DashboardHomeView() {
  const isHydrated = useDashboardHydrated();
  const { data, error, isLoading } = useDashboardHomeData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }

  const summary = data?.summary ?? null;
  const trend = data?.trend ?? [];
  const transactions = data?.transactions ?? [];
  const userFullName = data?.userFullName || "Pengguna";

  return (
    <>
      <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden px-3 pb-28 pt-2">
        <header className="flex items-start justify-between gap-4 px-2 pb-3 pt-1.5">
          <div className="grid gap-0.5">
            <p className="text-[11px] font-medium text-secondary/32">Senin, 29 Juni 2026</p>
            <h1 className="text-[1.7rem] font-bold leading-none tracking-[-0.05em] text-secondary">
              Halo, {userFullName}
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

        <section className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%),linear-gradient(145deg,#4478d0_0%,#3c70ca_48%,#2858af_100%)] px-4 py-4 text-white shadow-[0_14px_34px_rgba(48,102,190,0.24)]">
          {summary ? (
            <>
              <p className="text-[11px] font-semibold tracking-[-0.01em] text-white/68">
                Estimasi gaji bulan ini
              </p>
              <h2 className="mt-1.5 text-[2.2rem] font-bold leading-none tracking-[-0.07em] sm:text-[2.45rem]">
                {summary.estimatedMonthlyIncome}
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-semibold">
                <div className="flex min-h-9 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-emerald-200">
                  <span className="rounded-full bg-emerald-400/16 px-1.5 py-0.5 text-[9px] text-emerald-100">
                    {summary.monthlyGrowth}
                  </span>
                  <span className="text-white/72">vs bulan lalu</span>
                </div>
                <div className="flex min-h-9 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  <span className="text-[9px] text-emerald-100">{summary.riskLabel}</span>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-3 border-t border-white/10 pt-3.5">
                <div>
                  <p className="text-[10px] text-white/44">Hari ini</p>
                  <p className="mt-1 text-[0.95rem] font-semibold leading-5">
                    {summary.latestDailyIncome}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/44">{summary.activeDays} entri</p>
                  <p className="mt-1 text-[0.95rem] font-semibold leading-5">Rantai Valid</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/44">Model</p>
                  <p className="mt-1 text-[0.95rem] font-semibold leading-5 capitalize">
                    {summary.trendModel}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      summary.isDataSufficient ? "bg-emerald-300" : "bg-amber-300"
                    }`}
                  />
                  <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-white/90">
                    {summary.insightTitle}
                  </p>
                  <span className="shrink-0 text-[10px] font-medium text-white/52">
                    {summary.confidenceLabel}
                  </span>
                  <DashboardInsightInfo copy={summary.insightCopy} />
                </div>
              </div>
            </>
          ) : (
            <div className="py-1">
              <DashboardEmptyState
                description={error || "Ringkasan penghasilan belum bisa dimuat sekarang."}
                icon="solar:chart-2-bold-duotone"
                title="Ringkasan belum tersedia"
                tone="error"
              />
            </div>
          )}
        </section>

        <div className="grid grid-cols-[1fr_auto] gap-3 pt-3">
          <PressButton
            className="min-h-14 w-full justify-center gap-2 bg-tertiary text-base font-bold text-secondary hover:bg-tertiary/96"
            href="/dashboard/income/new"
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
            <h3 className="text-sm font-semibold text-secondary">Tren 30 Hari Terakhir</h3>
            <span className="text-[11px] font-medium text-secondary/35">
              {summary?.monthLabel || "Bulan ini"}
            </span>
          </div>
          <div className="mt-1">
            {trend.length > 0 ? (
              <DashboardLineChart data={trend} />
            ) : (
              <DashboardEmptyState
                description="Tren belum bisa ditampilkan sekarang."
                icon="solar:graph-new-bold-duotone"
                title="Grafik belum tersedia"
                tone="error"
              />
            )}
          </div>
        </section>

        <section className="mt-3 rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
          <div className="pb-1">
            <h3 className="text-sm font-semibold text-secondary">Transaksi Terbaru</h3>
          </div>
          {transactions.length > 0 ? (
            <div className="grid">
              {transactions.map((transaction) => (
                <article
                  className="flex items-center justify-between gap-3 border-t border-black/6 py-3.5 first:border-t-0"
                  key={transaction.id}
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
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-[0.9rem] font-bold sm:text-sm ${
                        transaction.amount.startsWith("+")
                          ? "text-emerald-600"
                          : "text-secondary"
                      }`}
                    >
                      {transaction.amount}
                    </p>
                    <p className="mt-1 inline-flex rounded-md bg-secondary/[0.055] px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.04em] text-secondary/48">
                      {transaction.hashPreview}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              description={
                error
                  ? "Riwayat transaksi belum bisa dimuat sekarang."
                  : "Transaksi pertama kamu akan muncul di sini setelah dicatat."
              }
              icon="solar:bill-list-bold-duotone"
              title={error ? "Riwayat belum tersedia" : "Belum ada transaksi"}
              tone={error ? "error" : "default"}
            />
          )}
        </section>
      </main>

      <AppBottomNav items={getDashboardNavItems("home")} />
    </>
  );
}
