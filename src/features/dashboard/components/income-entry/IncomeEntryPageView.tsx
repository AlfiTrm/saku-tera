"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { useDashboardHomeData } from "@/src/features/dashboard/hooks/useDashboardHomeData";
import { DashboardEmptyState } from "@/src/features/dashboard/components/DashboardEmptyState";
import { DashboardScreenSkeleton } from "@/src/features/dashboard/components/DashboardScreenSkeleton";
import { IncomeEntryForm } from "./IncomeEntryForm";

export function IncomeEntryPageView() {
  const router = useRouter();
  const isHydrated = useDashboardHydrated();
  const { data, error, isLoading, reload } = useDashboardHomeData();

  if (!isHydrated || isLoading) {
    return <DashboardScreenSkeleton />;
  }

  if (!data) {
    return (
      <>
        <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden px-3 pb-28 pt-3">
          <DashboardEmptyState
            description={error || "Coba muat ulang sebentar lagi."}
            icon="solar:danger-circle-bold-duotone"
            title="Form belum bisa dimuat"
          />
        </main>
      </>
    );
  }

  return (
    <>
      <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden px-4 pb-28 pt-3">
        <header className="px-1 pb-4">
          <Link
            className="mb-3 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-1 text-sm font-semibold text-secondary/80 transition-opacity hover:opacity-70"
            href="/dashboard"
          >
            <Icon className="h-4 w-4" icon="solar:alt-arrow-left-linear" />
            Kembali
          </Link>
          <div className="grid gap-1">
            <h1 className="text-[1.7rem] font-bold leading-none tracking-[-0.05em] text-secondary">
              Catat Transaksi
            </h1>
            <p className="text-sm leading-6 text-secondary/48">
              Tambahkan pemasukan secara manual atau isi cepat lewat file pendukung.
            </p>
          </div>
        </header>

        <IncomeEntryForm
          onClose={() => router.push("/dashboard")}
          onSuccess={async () => {
            await reload();
            router.push("/dashboard");
          }}
          sourceOptions={data.sourceOptions}
        />
      </main>

    </>
  );
}
