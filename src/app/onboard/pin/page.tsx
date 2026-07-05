"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import {
  clearPendingLoginPhone,
  clearPendingPinSetup,
  readPendingPinSetup,
  writeAuthSession,
} from "@/src/features/auth/lib/auth-storage";
import { setPin as submitPin } from "@/src/features/auth/services/authService";
import { OnboardingScreenSkeleton } from "@/src/features/onboarding/components/OnboardingScreenSkeleton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { OtpInput } from "@/src/features/onboarding/components/OtpInput";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

export default function PinPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [pin, setPinValue] = useState(() => readOnboardingDraft().pin);
  const [confirmPin, setConfirmPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const onboardingDraft = readOnboardingDraft();
    const pendingSetup = readPendingPinSetup();

    if (!onboardingDraft.otpRequestId && !pendingSetup?.sessionToken) {
      router.replace("/login");
    }
  }, [router]);

  if (!isHydrated) {
    return <OnboardingScreenSkeleton />;
  }

  const draft = readOnboardingDraft();
  const pendingSetup = readPendingPinSetup();
  const isLoginPinSetup = pendingSetup?.source === "login";
  const backHref = isLoginPinSetup ? "/login" : "/onboard/verify";
  const canContinue = pin.length === 6 && confirmPin.length === 6 && pin === confirmPin;

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    const sessionToken = pendingSetup?.sessionToken || draft.otpRequestId;

    if (!sessionToken) {
      setErrorMessage("Session PIN tidak ditemukan. Coba ulangi dari awal.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await submitPin({
        pin,
        sessionToken,
      });

      writeAuthSession(result.session);
      writeOnboardingDraft({ pin });
      clearPendingPinSetup();
      clearPendingLoginPhone();

      router.push(isLoginPinSetup ? "/dashboard" : "/onboard/work");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "PIN belum bisa disimpan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      backHref={backHref}
      currentStep={3}
      description={
        isLoginPinSetup
          ? "Nomor ini belum punya PIN. Buat PIN dulu untuk lanjut masuk."
          : "PIN ini nanti dipakai saat kamu login ke aplikasi."
      }
      showProgress={false}
      title={isLoginPinSetup ? "Buat PIN baru" : "Buat PIN kamu"}
    >
      <div className="mt-4 grid gap-5">
        <div className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">PIN 6 digit</span>
          <OtpInput onChange={setPinValue} value={pin} />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">Ulangi PIN</span>
          <OtpInput onChange={setConfirmPin} value={confirmPin} />
        </div>

        {!canContinue && confirmPin.length === 6 && pin !== confirmPin ? (
          <p className="text-sm font-medium text-red-500">PIN belum sama. Coba cek lagi.</p>
        ) : null}

        {errorMessage ? (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 min-h-13 w-full justify-center py-3 text-base"
          disabled={!canContinue || isSubmitting}
          onClick={handleContinue}
          variant="primary"
        >
          {isSubmitting ? "Menyimpan PIN..." : "Simpan PIN"}
        </PressButton>

        <p className="text-center text-sm leading-6 text-secondary/38">
          Gunakan PIN yang mudah kamu ingat, tapi tidak mudah ditebak orang lain.
        </p>
      </div>
    </OnboardingShell>
  );
}
