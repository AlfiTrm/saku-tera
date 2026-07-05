"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import {
  clearPendingLoginPhone,
  clearPendingPinSetup,
  writePendingPinSetup,
  writePendingLoginPhone,
} from "@/src/features/auth/lib/auth-storage";
import { checkPhone } from "@/src/features/auth/services/authService";
import { PhoneNumberField } from "@/src/features/onboarding/components/PhoneNumberField";
import { OnboardingScreenSkeleton } from "@/src/features/onboarding/components/OnboardingScreenSkeleton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";

function subscribe() {
  return () => undefined;
}

export default function LoginPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return <OnboardingScreenSkeleton />;
  }

  const canContinue = phone.trim().length >= 10;

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      clearPendingLoginPhone();
      clearPendingPinSetup();

      const result = await checkPhone({
        phoneNumber: phone,
      });

      writePendingLoginPhone(phone);

      if (result.hasPin) {
        router.push("/login/pin");
        return;
      }

      if (!result.sessionToken) {
        setErrorMessage("Session PIN belum tersedia. Coba lagi sebentar.");
        return;
      }

      writePendingPinSetup({
        phone,
        sessionToken: result.sessionToken,
        source: "login",
      });

      router.push("/onboard/pin");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nomor HP belum bisa dicek. Coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      currentStep={1}
      description="Masukkan nomor HP yang sudah terdaftar untuk lanjut ke PIN."
      showProgress={false}
      title="Masuk ke Sakutera"
    >
      <div className="mt-4 grid gap-5">
        <div className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">Nomor HP</span>
          <PhoneNumberField
            onChange={({ phone: nextPhone }) => {
              setPhone(nextPhone);
            }}
            value={phone}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 min-h-13 w-full justify-center py-3 text-base"
          disabled={!canContinue || isSubmitting}
          onClick={handleContinue}
          variant="primary"
        >
          {isSubmitting ? "Memeriksa..." : "Lanjut ke PIN"}
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
