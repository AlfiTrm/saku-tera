"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import {
  clearAuthState,
  readAuthSession,
} from "@/src/features/auth/lib/auth-storage";
import { logout } from "@/src/features/auth/services/authService";
import { useDashboardHydrated } from "@/src/features/dashboard/hooks/useDashboardHydrated";
import { DashboardScreenSkeleton } from "@/src/features/dashboard/components/DashboardScreenSkeleton";

export function AccountView() {
  const router = useRouter();
  const isHydrated = useDashboardHydrated();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return <DashboardScreenSkeleton />;
  }

  async function handleLogout() {
    if (isSubmitting) {
      return;
    }

    const session = readAuthSession();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (session?.accessToken) {
        await logout(session.accessToken);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Logout belum bisa diproses. Coba lagi.",
      );
      setIsSubmitting(false);
      return;
    }

    clearAuthState();
    router.replace("/login");
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[29rem] flex-col px-3 pb-28 pt-3">
        <header className="px-2 pb-4">
          <Link
            className="mb-2 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-secondary/72"
            href="/dashboard"
          >
            <Icon className="h-4 w-4" icon="solar:alt-arrow-left-linear" />
            Kembali
          </Link>
          <h1 className="text-[1.65rem] font-bold leading-none tracking-[-0.05em] text-secondary">
            Akun
          </h1>
          <p className="mt-1 text-sm font-medium text-secondary/36">
            Kelola sesi login aplikasi kamu.
          </p>
        </header>

        <section className="rounded-[22px] border border-black/6 bg-white px-4 py-4 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/[0.03] text-primary">
              <Icon className="h-5 w-5" icon="solar:shield-user-bold-duotone" />
            </span>
            <div className="grid gap-1">
              <p className="text-base font-semibold text-secondary">Sesi aktif</p>
              <p className="text-sm leading-6 text-secondary/52">
                Keluar akan menghapus token dari perangkat ini. Kamu perlu login
                lagi untuk masuk.
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-black/6 pt-4">
            <PressButton
              className="min-h-14 w-full justify-center gap-2 text-base"
              disabled={isSubmitting}
              onClick={handleLogout}
              variant="outline"
            >
              <Icon className="h-5 w-5" icon="solar:logout-2-bold-duotone" />
              {isSubmitting ? "Keluar..." : "Keluar dari akun"}
            </PressButton>
            {errorMessage ? (
              <p className="mt-3 text-center text-sm font-medium text-red-500">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </section>
      </main>

    </>
  );
}
