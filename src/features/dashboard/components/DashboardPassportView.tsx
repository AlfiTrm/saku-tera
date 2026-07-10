"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { BottomSheet } from "@/src/shared/components/overlays";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { useDashboardPassportData } from "@/src/features/dashboard/hooks/useDashboardPassportData";
import type {
  DashboardPassportMetric,
  DashboardPassportPeriod,
} from "@/src/features/dashboard/types/dashboardData";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardScreenSkeleton } from "./DashboardScreenSkeleton";

function PassportIssueSheet({
  isOpen,
  isSubmitting,
  metrics,
  onClose,
  onIssue,
  onSelectPeriod,
  periods,
}: {
  isOpen: boolean;
  isSubmitting: boolean;
  metrics: DashboardPassportMetric[];
  onClose: () => void;
  onIssue: () => void;
  onSelectPeriod: (period: DashboardPassportPeriod["id"]) => void;
  periods: DashboardPassportPeriod[];
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-4 px-5 pb-[calc(1.2rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-secondary/10" />

        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/6 text-secondary/70"
            onClick={onClose}
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:alt-arrow-left-linear" />
          </button>
          <div className="grid gap-0.5">
            <p className="text-[11px] font-medium text-secondary/30">Konfirmasi</p>
            <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-secondary">
              Konfirmasi Penerbitan
            </h2>
          </div>
        </div>

        <section className="grid gap-2">
          <p className="text-sm font-semibold text-secondary">Pilih Periode Data</p>
          <div className="grid grid-cols-3 gap-2">
            {periods.map((option) => (
              <button
                className={`grid min-h-[70px] place-items-center rounded-[18px] border px-2 py-3 text-center transition-colors ${
                  option.selected
                    ? "border-primary bg-primary text-white shadow-[0_10px_22px_rgba(48,102,190,0.22)]"
                    : "border-black/10 bg-white text-secondary/40"
                }`}
                key={option.id}
                onClick={() => onSelectPeriod(option.id)}
                type="button"
              >
                <span className="text-sm font-bold">{option.label}</span>
                <span
                  className={`text-[11px] ${option.selected ? "text-white/76" : "text-secondary/30"}`}
                >
                  {option.range}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-2">
          <p className="text-sm font-semibold text-secondary">Data yang Akan Dimasukkan</p>
          <div className="rounded-[22px] border border-black/6 bg-white p-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((metric) => (
                <article
                  className={`rounded-[16px] px-3 py-3 ${
                    metric.tone === "success" ? "bg-emerald-50" : "bg-secondary/[0.03]"
                  }`}
                  key={metric.label}
                >
                  <p className="text-[11px] font-medium leading-4 text-secondary/32">
                    {metric.label}
                  </p>
                  <p
                    className={`mt-2 text-[1.15rem] font-bold tracking-[-0.04em] ${
                      metric.tone === "success" ? "text-emerald-600" : "text-primary"
                    }`}
                  >
                    {metric.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-3 grid gap-2 border-t border-black/6 pt-3 text-sm font-semibold text-primary">
              <p className="flex items-center gap-2">
                <Icon className="h-4 w-4" icon="solar:shield-keyhole-bold-duotone" />
                Ditandatangani Digital (RSA-2048)
              </p>
              <p className="flex items-center gap-2">
                <Icon className="h-4 w-4" icon="solar:verified-check-bold-duotone" />
                Kode verifikasi unik digenerate
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-[18px] border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-secondary/55">
          <p className="flex items-start gap-2">
            <Icon
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              icon="solar:info-circle-bold-duotone"
            />
            Income Passport bukan pinjaman. Data kamu hanya dibagikan dengan izin
            eksplisit kamu. Kamu bisa mencabut akses kapan saja.
          </p>
        </div>

        <PressButton
          className="min-h-[58px] w-full justify-center text-base"
          disabled={metrics.length === 0 || isSubmitting}
          onClick={onIssue}
          variant="primary"
        >
          {isSubmitting ? "Menerbitkan..." : "Terbitkan Sekarang"}
        </PressButton>
      </div>
    </BottomSheet>
  );
}

export function DashboardPassportView() {
  const [isIssueSheetOpen, setIsIssueSheetOpen] = useState(false);
  const isHydrated = useDashboardHydrated();
  const {
    data,
    error,
    isIssuing,
    isLoading,
    issuePassport,
    setSelectedPeriod,
  } = useDashboardPassportData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }
  const safeData = data;

  return (
    <>
      <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden px-3 pb-28 pt-3">
        <header className="px-2 pb-3">
          <h1 className="text-[1.65rem] font-bold leading-none tracking-[-0.05em] text-secondary">
            Income Passport
          </h1>
          <p className="mt-1 text-sm font-medium text-secondary/32">
            Bukti penghasilan terverifikasi kamu
          </p>
        </header>

        <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#4074cc_0%,#315fb4_100%)] px-4 py-4 text-white shadow-[0_14px_34px_rgba(48,102,190,0.22)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-white/68">Status kelayakan</p>
              <h2 className="mt-1.5 text-[1.55rem] font-bold leading-tight tracking-[-0.04em]">
                {safeData?.summary.headline || "Status passport belum tersedia"}
              </h2>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center text-emerald-200">
              <Icon className="h-6 w-6" icon="solar:shield-check-bold" />
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-white/76 sm:text-[11px]">
              <span>{safeData?.summary.activeDaysLabel || "Data aktif"}</span>
              <span className="shrink-0">
                {safeData?.summary.progressValueLabel || "Data belum terbaca"}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/18">
              <div
                className="h-2 rounded-full bg-emerald-300"
                style={{
                  width: `${Math.round((safeData?.summary.progressRatio ?? 0) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-white/64">
              {safeData?.summary.supportingCopy ||
                "Cek lagi nanti setelah data passport berhasil dimuat."}
            </p>
          </div>
        </section>

        <section className="mt-4">
          <div className="px-1 pb-2">
            <h3 className="text-sm font-semibold text-secondary">Passport Aktif</h3>
          </div>

          {safeData?.activePassport ? (
            <article className="overflow-hidden rounded-[22px] border border-black/6 bg-white shadow-[0_12px_24px_rgba(23,23,56,0.05)]">
              <div className="flex items-center justify-between bg-secondary px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-primary">
                    <Icon className="h-4 w-4" icon="solar:shield-check-bold" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{safeData.activePassport.issuerLabel}</p>
                    <p className="text-[11px] text-white/54">income passport</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/24 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  {safeData.activePassport.statusLabel}
                </span>
              </div>

              <div className="grid gap-4 px-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <article>
                    <p className="text-[11px] font-medium text-secondary/32">EMI</p>
                    <p className="mt-1 text-[1.55rem] font-bold tracking-[-0.04em] text-secondary">
                      {safeData.activePassport.emi}
                    </p>
                  </article>
                  <article>
                    <p className="text-[11px] font-medium text-secondary/32">Periode</p>
                    <p className="mt-1 text-[1rem] font-bold text-secondary">
                      {safeData.activePassport.periodLabel}
                    </p>
                  </article>
                  <article>
                    <p className="text-[11px] font-medium text-secondary/32">Risiko</p>
                    <p className="mt-1 text-[1rem] font-bold text-emerald-600">
                      {safeData.activePassport.riskLabel}
                    </p>
                  </article>
                  <article>
                    <p className="text-[11px] font-medium text-secondary/32">Diterbitkan</p>
                    <p className="mt-1 text-[1rem] font-bold text-secondary">
                      {safeData.activePassport.issuedAt}
                    </p>
                  </article>
                </div>

                <article className="rounded-[18px] bg-secondary/[0.03] px-4 py-3">
                  <p className="text-[11px] font-medium text-secondary/32">Kode Unik Verifikasi</p>
                  <p className="mt-1 break-all text-sm font-semibold tracking-[0.04em] text-secondary">
                    {safeData.activePassport.verificationCode}
                  </p>
                </article>

                <div className="grid gap-3 sm:grid-cols-2">
                  <PressButton className="min-h-13 w-full justify-center" variant="primary">
                    Bagikan
                  </PressButton>
                  <PressButton
                    className="min-h-13 w-full justify-center"
                    href="/dashboard/passport/access"
                    variant="outline"
                  >
                    Detail
                  </PressButton>
                </div>
              </div>
            </article>
          ) : (
            <DashboardEmptyState
              action={
                <PressButton
                  className="px-4 py-2 text-sm"
                  disabled={!safeData?.summary.isEligible}
                  onClick={() => setIsIssueSheetOpen(true)}
                  variant="primary"
                >
                  Terbitkan Sekarang
                </PressButton>
              }
              description={
                error
                  ? error
                  : "Terbitkan passport pertama setelah data penghasilanmu cukup stabil."
              }
              icon="solar:wallet-money-bold-duotone"
              title={error ? "Passport belum tersedia" : "Belum ada passport aktif"}
              tone={error ? "error" : "default"}
            />
          )}
        </section>

        <div className="pt-4">
          <PressButton
            className="min-h-14 w-full justify-center gap-2 bg-tertiary text-base font-bold text-secondary hover:bg-tertiary/96"
            disabled={!safeData?.summary.isEligible}
            onClick={() => setIsIssueSheetOpen(true)}
            variant="secondary"
          >
            <Icon className="h-5 w-5" icon="solar:add-circle-bold" />
            Terbitkan Passport Baru
          </PressButton>
        </div>
      </main>

      <PassportIssueSheet
        isOpen={isIssueSheetOpen}
        isSubmitting={isIssuing}
        metrics={safeData?.metrics ?? []}
        onClose={() => setIsIssueSheetOpen(false)}
        onIssue={() => {
          void issuePassport().then((isSuccess) => {
            if (isSuccess) {
              setIsIssueSheetOpen(false);
            }
          });
        }}
        onSelectPeriod={setSelectedPeriod}
        periods={safeData?.issuePeriods ?? []}
      />
    </>
  );
}
