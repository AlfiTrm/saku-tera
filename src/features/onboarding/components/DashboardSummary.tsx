"use client";

import { useState, useSyncExternalStore } from "react";
import {
  emptyOnboardingDraft,
  readOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

const workLabels = {
  courier: "Kurir Online",
  driver: "Pengemudi Ojol",
  freelancer: "Freelancer",
  merchant: "Pedagang UMKM",
  other: "Pekerjaan Lainnya",
  "": "Belum diisi",
};

const sourceLabels = {
  "": "Belum dipilih",
  manual: "Input Manual",
  platform: "Hubungkan GoPay / OVO",
};

export function DashboardSummary() {
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [draft] = useState(() => {
    const storedDraft = readOnboardingDraft();
    return storedDraft.phone || storedDraft.fullName
      ? storedDraft
      : emptyOnboardingDraft;
  });

  if (!isHydrated) {
    return null;
  }

  return (
    <section className="grid w-full max-w-[42rem] gap-4 rounded-[2rem] border border-[rgba(255,255,250,0.08)] bg-[rgba(19,25,46,0.78)] p-8 text-white shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-[12px]">
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,250,0.78)]">
        Dashboard
      </p>
      <h1 className="max-w-[12ch] text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[0.96] tracking-[-0.05em]">
        Selamat datang, {draft.fullName || "Sakutera User"}.
      </h1>
      <p className="max-w-[42rem] text-base leading-7 text-[rgba(255,255,250,0.78)]">
        Flow onboarding selesai. Ini ringkasan data awal yang nanti akan kita
        sambungkan ke API.
      </p>

      <div className="grid gap-3 pt-2">
        <article className="rounded-[18px] border border-white/8 bg-white/6 px-4 py-4">
          <p className="text-sm text-white/50">Nomor HP</p>
          <p className="mt-1 text-lg font-semibold">
            {draft.phoneDisplay || draft.phone || "-"}
          </p>
        </article>
        <article className="rounded-[18px] border border-white/8 bg-white/6 px-4 py-4">
          <p className="text-sm text-white/50">Jenis pekerjaan</p>
          <p className="mt-1 text-lg font-semibold">
            {draft.workType === "other" && draft.workOther
              ? draft.workOther
              : workLabels[draft.workType]}
          </p>
        </article>
        <article className="rounded-[18px] border border-white/8 bg-white/6 px-4 py-4">
          <p className="text-sm text-white/50">Sumber penghasilan</p>
          <p className="mt-1 text-lg font-semibold">
            {sourceLabels[draft.incomeSource]}
          </p>
        </article>
      </div>
    </section>
  );
}
