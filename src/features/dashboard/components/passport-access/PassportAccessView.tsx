"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { DashboardEmptyState } from "@/src/features/dashboard/components/DashboardEmptyState";
import { DashboardScreenSkeleton } from "@/src/features/dashboard/components/DashboardScreenSkeleton";
import { PassportGrantSheet } from "@/src/features/dashboard/components/passport-access/PassportGrantSheet";
import { PassportAccessCard } from "@/src/features/dashboard/components/passport-access/PassportAccessCard";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { usePassportAccessData } from "@/src/features/dashboard/hooks/usePassportAccessData";

export function PassportAccessView() {
  const [isGrantSheetOpen, setIsGrantSheetOpen] = useState(false);
  const isHydrated = useDashboardHydrated();
  const {
    activeEntries,
    error,
    grantAccess,
    isGranting,
    isLoading,
    organizations,
    otherEntries,
    revokeAccess,
    revokingConsentId,
  } = usePassportAccessData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[29rem] flex-col bg-white px-3 pb-28 pt-3">
        <header className="px-2 pb-3">
          <Link
            className="mb-2 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-secondary/72"
            href="/dashboard/passport"
          >
            <Icon className="h-4 w-4" icon="solar:alt-arrow-left-linear" />
            Kembali
          </Link>
          <h1 className="text-[1.65rem] font-bold leading-none tracking-[-0.05em] text-secondary">
            Kelola Akses Data
          </h1>
          <p className="mt-1 text-sm font-medium text-secondary/32">
            Siapa yang bisa melihat Income Passport kamu
          </p>
          <Link
            className="mt-3 inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-sm font-semibold text-secondary/72"
            href="/dashboard/passport/history"
          >
            <Icon className="h-4 w-4" icon="solar:clock-circle-linear" />
            Lihat Riwayat
          </Link>
        </header>

        <section>
          <div className="px-1 pb-2">
            <h2 className="text-sm font-semibold text-secondary">Akses Aktif</h2>
          </div>
          {activeEntries.length > 0 ? (
            <div className="grid gap-3">
              {activeEntries.map((entry) => (
                <PassportAccessCard
                  entry={entry}
                  isRevoking={revokingConsentId === entry.id}
                  key={entry.id}
                  onRevoke={(consentId) => {
                    void revokeAccess(consentId);
                  }}
                />
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              description={
                error
                  ? error
                  : "Belum ada organisasi yang sedang memegang akses aktif."
              }
              icon="solar:shield-user-bold-duotone"
              title={error ? "Akses belum tersedia" : "Belum ada akses aktif"}
              tone={error ? "error" : "default"}
            />
          )}
        </section>

        {otherEntries.length > 0 ? (
          <section className="mt-4">
            <div className="px-1 pb-2">
              <h2 className="text-sm font-semibold text-secondary">Status Lainnya</h2>
            </div>
            <div className="grid gap-3">
              {otherEntries.map((entry) => (
                <PassportAccessCard entry={entry} key={entry.id} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="pt-4">
          <PressButton
            className="min-h-14 w-full justify-center gap-2 bg-tertiary text-base font-bold text-secondary hover:bg-tertiary/96"
            disabled={organizations.length === 0}
            onClick={() => setIsGrantSheetOpen(true)}
            variant="secondary"
          >
            <Icon className="h-5 w-5" icon="solar:share-bold" />
            Bagikan ke Pihak Baru
          </PressButton>
        </div>
      </main>

      <PassportGrantSheet
        isOpen={isGrantSheetOpen}
        isSubmitting={isGranting}
        onClose={() => setIsGrantSheetOpen(false)}
        onSubmit={grantAccess}
        organizations={organizations}
      />
    </>
  );
}
