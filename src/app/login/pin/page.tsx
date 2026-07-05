"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import {
  clearPendingLoginPhone,
  readPendingLoginPhone,
  writeAuthSession,
} from "@/src/features/auth/lib/auth-storage";
import { loginWithPin } from "@/src/features/auth/services/authService";
import { OtpInput } from "@/src/features/onboarding/components/OtpInput";
import { OnboardingScreenSkeleton } from "@/src/features/onboarding/components/OnboardingScreenSkeleton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";

function subscribe() {
  return () => undefined;
}

export default function LoginPinPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [pin, setPin] = useState("");
  const phone = readPendingLoginPhone();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const pendingPhone = readPendingLoginPhone();

    if (!pendingPhone) {
      router.replace("/login");
      return;
    }

  }, [router]);

  if (!isHydrated) {
    return <OnboardingScreenSkeleton />;
  }

  const canContinue = pin.length === 6;

  async function handleLogin() {
    if (!canContinue || isSubmitting) {
      return;
    }

    if (!phone) {
      setErrorMessage("Nomor login tidak ditemukan. Ulangi dari awal.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await loginWithPin({
        phoneNumber: phone,
        pin,
      });

      writeAuthSession(result.session);
      clearPendingLoginPhone();
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "PIN belum sesuai. Coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      backHref="/login"
      currentStep={2}
      description={`Masukkan PIN untuk nomor ${phone || "yang kamu pilih tadi"}.`}
      showProgress={false}
      title="Masukkan PIN"
    >
      <div className="mt-4 grid gap-5">
        <div className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">PIN 6 digit</span>
          <OtpInput onChange={setPin} value={pin} />
        </div>

        {errorMessage ? (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 min-h-13 w-full justify-center py-3 text-base"
          disabled={!canContinue || isSubmitting}
          onClick={handleLogin}
          variant="primary"
        >
          {isSubmitting ? "Masuk..." : "Masuk"}
        </PressButton>

        <p className="text-center text-sm font-medium text-secondary/50">
          Belum punya akun?{" "}
          <Link className="text-primary" href="/onboard/register">
            Daftar
          </Link>
        </p>
      </div>
    </OnboardingShell>
  );
}
