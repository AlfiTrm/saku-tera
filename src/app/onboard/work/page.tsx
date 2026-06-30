"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { WorkOptionCard } from "@/src/features/onboarding/components/WorkOptionCard";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
  type WorkType,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

const workOptions: Array<{
  description: string;
  icon: string;
  title: string;
  value: Exclude<WorkType, "" | "other">;
}> = [
  {
    description: "Gojek, Grab, dll.",
    icon: "solar:map-point-wave-bold-duotone",
    title: "Pengemudi Ojol",
    value: "driver",
  },
  {
    description: "ShopeeFood, GoSend, dll.",
    icon: "solar:delivery-bold-duotone",
    title: "Kurir Online",
    value: "courier",
  },
  {
    description: "Desainer, kreator, dll.",
    icon: "solar:code-square-bold-duotone",
    title: "Freelancer",
    value: "freelancer",
  },
  {
    description: "Warung, online shop, dll.",
    icon: "solar:shop-2-bold-duotone",
    title: "Pedagang UMKM",
    value: "merchant",
  },
];

export default function WorkPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [workType, setWorkType] = useState<WorkType>(
    () => readOnboardingDraft().workType,
  );
  const [workOther, setWorkOther] = useState(
    () => readOnboardingDraft().workOther,
  );

  if (!isHydrated) {
    return null;
  }

  const canContinue =
    workType !== "" && (workType !== "other" || workOther.trim().length >= 3);

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    writeOnboardingDraft({ workOther, workType });
    router.push("/onboard/income-source");
  }

  return (
    <OnboardingShell
      backHref="/onboard/verify"
      currentStep={1}
      description="Ini membantu kami menyesuaikan pengalamanmu"
      skipHref="/onboard/income-source"
      title="Kamu bekerja sebagai apa?"
      totalSteps={3}
    >
      <div className="mt-4 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {workOptions.map((option) => (
            <WorkOptionCard
              description={option.description}
              icon={<Icon className="h-5 w-5" icon={option.icon} />}
              isSelected={workType === option.value}
              key={option.value}
              onClick={() => setWorkType(option.value)}
              title={option.title}
            />
          ))}
        </div>

        <button
          className={`flex h-14 items-center justify-between rounded-[18px] border px-4 text-left text-base font-medium transition-colors ${
            workType === "other"
              ? "border-primary bg-primary/4 text-secondary"
              : "border-black/10 bg-white text-secondary/55"
          }`}
          onClick={() => setWorkType("other")}
          type="button"
        >
          <span>Pekerjaan lainnya...</span>
          <span>›</span>
        </button>

        {workType === "other" ? (
          <input
            className="h-14 rounded-[18px] border border-black/10 bg-white px-4 text-base text-secondary outline-none placeholder:text-secondary/35 focus:border-primary"
            onChange={(event) => setWorkOther(event.target.value)}
            placeholder="Contoh: Penjahit rumahan"
            value={workOther}
          />
        ) : null}

        <PressButton
          className="mt-2 w-full justify-center py-3 text-base"
          disabled={!canContinue}
          onClick={handleContinue}
          variant="primary"
        >
          Lanjutkan
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
