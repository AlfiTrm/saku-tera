"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
  type IncomeSource,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

const sourceOptions: Array<{
  badge?: string;
  description: string;
  icon: string;
  title: string;
  value: Exclude<IncomeSource, "">;
}> = [
  {
    badge: "Disarankan",
    description:
      "Transaksi masuk otomatis. Kami hanya membaca data masuk, tidak bisa transfer atau tarik saldo.",
    icon: "?",
    title: "Hubungkan GoPay / OVO",
    value: "platform",
  },
  {
    description:
      "Catat sendiri dalam kurun dari 10 detik. Tersedia di semua kondisi, tanpa koneksi platform.",
    icon: "✎",
    title: "Input Manual",
    value: "manual",
  },
];

export default function IncomeSourcePage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [incomeSource, setIncomeSource] = useState<IncomeSource>(
    () => readOnboardingDraft().incomeSource,
  );

  if (!isHydrated) {
    return null;
  }

  function handleContinue() {
    if (!incomeSource) {
      return;
    }

    writeOnboardingDraft({ incomeSource });
    router.push("/onboard/protection");
  }

  return (
    <OnboardingShell
      backHref="/onboard/work"
      currentStep={2}
      description="Pilih cara pencatatan otomatis atau manual"
      skipHref="/onboard/protection"
      title="Dari mana penghasilan kamu masuk?"
      totalSteps={3}
    >
      <div className="mt-4 grid gap-4">
        {sourceOptions.map((option) => {
          const isSelected = incomeSource === option.value;

          return (
            <button
              className={`grid gap-3 rounded-[22px] border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/4 shadow-[0_0_0_1px_var(--color-primary)]"
                  : "border-black/10 bg-white hover:border-primary/50"
              }`}
              key={option.value}
              onClick={() => setIncomeSource(option.value)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] text-xl ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-black/[0.03] text-secondary/45"
                  }`}
                >
                  {option.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <p className="text-[1.02rem] font-semibold leading-6 text-secondary">
                        {option.title}
                      </p>
                      <p className="text-sm leading-6 text-secondary/55">
                        {option.description}
                      </p>
                    </div>

                    {option.badge ? (
                      <span className="mt-0.5 shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
                        {option.badge}
                      </span>
                    ) : null}
                  </div>

                  {option.value === "platform" ? (
                    <p className="mt-2 text-sm font-medium leading-5 text-primary">
                      Hanya membaca data masuk.
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}

        <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          Kamu bisa putus koneksi kapan saja. Data sebelumnya tetap aman di
          ledger kamu.
        </div>

        <PressButton
          className="mt-2 w-full justify-center py-3 text-base"
          disabled={!incomeSource}
          onClick={handleContinue}
          variant="primary"
        >
          {incomeSource === "manual" ? "Pilih Input Manual" : "Hubungkan GoPay / OVO"}
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
