"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { mapDraftToOnboardingPayload } from "@/src/features/onboarding/mappers/onboardingMappers";
import {
  markOnboardingComplete,
  readOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";
import { submitOnboardingProfile } from "@/src/features/onboarding/services/onboardingService";

const benefits = [
  {
    description: "Bahkan oleh tim Sakutera sekalipun",
    icon: "solar:shield-check-bold-duotone",
    title: "Data kamu tidak bisa dihapus atau diubah",
  },
  {
    description: "Pilih siapa yang bisa melihat datamu",
    icon: "solar:eye-scan-bold-duotone",
    title: "Kamu pegang kendali penuh",
  },
];

export default function ProtectionPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFinish() {
    if (isSubmitting) {
      return;
    }

    const payload = mapDraftToOnboardingPayload(readOnboardingDraft());

    if (!payload) {
      setErrorMessage("Data onboarding belum lengkap. Cek langkah sebelumnya dulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await submitOnboardingProfile(payload);

      markOnboardingComplete();
      router.push(result.nextRoute);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Data belum bisa disimpan. Coba lagi sebentar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      backHref="/onboard/income-source"
      currentStep={3}
      description="Buku kas digital yang tidak bisa diubah siapapun"
      title="Penghasilanmu Terlindungi"
      totalSteps={3}
    >
      <div className="mt-4 grid gap-4">
        <section className="overflow-hidden rounded-[22px] bg-[#11160f] p-4 text-white shadow-[0_16px_50px_rgba(17,23,45,0.18)]">
          <div className="grid gap-3">
            <div className="flex items-center justify-between text-[11px] tracking-[0.08em] text-white/45">
              <span>Verifiable Ledger</span>
              <span>29 Jun</span>
            </div>
            <article className="rounded-[16px] border border-primary/30 bg-[#172034] px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">Entri #1 - Rp 285.000</p>
                <span className="text-xs text-white/40">29 Jun</span>
              </div>
              <p className="mt-1 text-[11px] text-white/35">
                hash: a87bc21d6a4f93ea...
              </p>
            </article>
            <article className="rounded-[16px] border border-white/8 bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">Entri #2 - Rp 310.000</p>
                <span className="text-xs text-white/40">28 Jun</span>
              </div>
              <p className="mt-1 text-[11px] text-white/35">
                hash: 98fa256 | data + a37fb2...
              </p>
            </article>
            <p className="text-sm font-medium text-emerald-400">
              Rantai hash valid - Tidak bisa dimanipulasi
            </p>
          </div>
        </section>

        <div className="grid gap-3">
          {benefits.map((benefit) => (
            <article
              className="flex items-start gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-4"
              key={benefit.title}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.03] text-primary">
                <Icon className="h-5 w-5" icon={benefit.icon} />
              </span>
              <div className="grid gap-1">
                <p className="text-base font-semibold text-secondary">{benefit.title}</p>
                <p className="text-sm leading-6 text-secondary/55">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>

        {errorMessage ? (
          <p className="text-center text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 w-full justify-center bg-tertiary py-3 text-base text-secondary hover:bg-tertiary/95"
          disabled={isSubmitting}
          onClick={handleFinish}
          variant="secondary"
        >
          {isSubmitting ? "Menyimpan Data..." : "Mulai Catat Penghasilan!"}
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
