"use client";

import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { markOnboardingComplete } from "@/src/features/onboarding/lib/onboarding-storage";

const benefits = [
  {
    description: "Bahkan oleh tim Sakutera sekalipun",
    icon: "🛡️",
    title: "Data kamu tidak bisa dihapus atau diubah",
  },
  {
    description: "Pilih siapa yang bisa melihat datamu",
    icon: "🫂",
    title: "Kamu pegang kendali penuh",
  },
];

export default function ProtectionPage() {
  const router = useRouter();

  function handleFinish() {
    markOnboardingComplete();
    router.push("/dashboard");
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
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-white/45">
              <span>Verifiable Ledger</span>
              <span>29 Jun</span>
            </div>
            <article className="rounded-[16px] border border-primary/30 bg-[#172034] px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">Entri #1 — Rp 285.000</p>
                <span className="text-xs text-white/40">29 Jun</span>
              </div>
              <p className="mt-1 text-[11px] text-white/35">
                hash: a87bc21d6a4f93ea...
              </p>
            </article>
            <article className="rounded-[16px] border border-white/8 bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">Entri #2 — Rp 310.000</p>
                <span className="text-xs text-white/40">28 Jun</span>
              </div>
              <p className="mt-1 text-[11px] text-white/35">
                hash: 98fa256 | data + a37fb2...
              </p>
            </article>
            <p className="text-sm font-medium text-emerald-400">
              ● Rantai hash valid · Tidak bisa dimanipulasi
            </p>
          </div>
        </section>

        <div className="grid gap-3">
          {benefits.map((benefit) => (
            <article
              className="flex items-start gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-4"
              key={benefit.title}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.03] text-lg">
                {benefit.icon}
              </span>
              <div className="grid gap-1">
                <p className="text-base font-semibold text-secondary">
                  {benefit.title}
                </p>
                <p className="text-sm leading-6 text-secondary/55">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <PressButton
          className="mt-2 w-full justify-center bg-tertiary py-3 text-base text-secondary hover:bg-tertiary/95"
          onClick={handleFinish}
          variant="secondary"
        >
          Mulai Catat Penghasilan!
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
