"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
  type IncomeSource,
} from "@/src/features/onboarding/lib/onboarding-storage";
import { getIncomeSources } from "@/src/features/onboarding/services/onboardingService";
import type { IncomeSourceOption } from "@/src/features/onboarding/types/onboardingContract";

function subscribe() {
  return () => undefined;
}

export default function IncomeSourcePage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [sourceOptions, setSourceOptions] = useState<IncomeSourceOption[]>([]);
  const [incomeSource, setIncomeSource] = useState<IncomeSource>(
    () => readOnboardingDraft().incomeSource,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isMounted = true;

    async function loadSources() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const nextSources = await getIncomeSources();

        if (!isMounted) {
          return;
        }

        setSourceOptions(nextSources);

        const recommendedSource = nextSources.find((source) => source.isAvailable);
        setIncomeSource(
          (currentSource) =>
            currentSource || ((recommendedSource?.type as IncomeSource) || ""),
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Pilihan sumber penghasilan belum bisa dimuat.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSources();

    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  function handleContinue() {
    if (!incomeSource) {
      return;
    }

    const selectedSource = sourceOptions.find((source) => source.type === incomeSource);

    writeOnboardingDraft({
      incomeSource,
      incomeSourceLabel: selectedSource?.label || "",
    });

    router.push("/onboard/protection");
  }

  return (
    <OnboardingShell
      backHref="/onboard/work"
      currentStep={2}
      description="Pilih cara pencatatan otomatis atau manual"
      title="Dari mana penghasilan kamu masuk?"
      totalSteps={3}
    >
      <div className="mt-4 grid gap-4">
        {sourceOptions.map((option) => {
          const isSelected = incomeSource === option.type;
          const isDisabled = !option.isAvailable;

          return (
            <button
              className={`grid gap-3 rounded-[22px] border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/4 shadow-[0_0_0_1px_var(--color-primary)]"
                  : isDisabled
                    ? "border-black/8 bg-black/[0.02] text-secondary/38"
                    : "border-black/10 bg-white hover:border-primary/50"
              }`}
              disabled={isDisabled}
              key={option.type}
              onClick={() => setIncomeSource(option.type as IncomeSource)}
              type="button"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] text-xl ${
                    isSelected
                      ? "bg-primary text-white"
                      : isDisabled
                        ? "bg-black/[0.03] text-secondary/28"
                        : "bg-black/[0.03] text-secondary/45"
                  }`}
                >
                  <Icon
                    icon={
                      option.type === "manual"
                        ? "solar:pen-2-bold-duotone"
                        : "solar:wallet-money-bold-duotone"
                    }
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <p className="text-[1.02rem] font-semibold leading-6 text-secondary">
                        {option.label}
                      </p>
                      <p className="text-sm leading-6 text-secondary/55">
                        {option.description}
                      </p>
                    </div>

                    {!option.isAvailable ? (
                      <span className="mt-0.5 shrink-0 rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-semibold text-secondary/45">
                        Segera
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {errorMessage ? (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 w-full justify-center py-3 text-base"
          disabled={!incomeSource || isLoading}
          onClick={handleContinue}
          variant="primary"
        >
          Lanjutkan
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
