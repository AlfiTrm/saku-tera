"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { OtpInput } from "@/src/features/onboarding/components/OtpInput";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

export default function VerifyPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [otpCode, setOtpCode] = useState(() => readOnboardingDraft().otpCode);
  const [phoneDisplay] = useState(
    () => readOnboardingDraft().phoneDisplay || readOnboardingDraft().phone,
  );

  useEffect(() => {
    const draft = readOnboardingDraft();

    if (!draft.phone) {
      router.replace("/onboard/register");
    }
  }, [router]);

  if (!isHydrated) {
    return null;
  }

  function handleVerify() {
    if (otpCode.length !== 6) {
      return;
    }

    writeOnboardingDraft({ otpCode });
    router.push("/onboard/work");
  }

  return (
    <OnboardingShell
      backHref="/onboard/register"
      currentStep={2}
      description={`Kode 6 digit dikirim ke ${phoneDisplay || "+62 812-••••-7890"} via WhatsApp`}
      showProgress={false}
      title="Cek SMS kamu"
    >
      <div className="mt-4 grid gap-5">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/8 text-2xl text-primary">
          💬
        </span>

        <OtpInput onChange={setOtpCode} value={otpCode} />

        <div className="flex items-center justify-between gap-3 text-sm text-secondary/45">
          <span className="rounded-full bg-black/[0.03] px-3 py-2">⏱ 4:32 tersisa</span>
          <button className="min-h-11 font-medium" type="button">
            Kirim ulang kode
          </button>
        </div>

        <PressButton
          className="mt-2 min-h-13 w-full justify-center py-3 text-base"
          disabled={otpCode.length !== 6}
          onClick={handleVerify}
          variant="primary"
        >
          Verifikasi
        </PressButton>

        <p className="text-center text-sm leading-6 text-secondary/38">
          Tidak menerima kode? Pastikan sinyal HP aktif dan coba kirim ulang
          setelah timer habis.
        </p>
      </div>
    </OnboardingShell>
  );
}
