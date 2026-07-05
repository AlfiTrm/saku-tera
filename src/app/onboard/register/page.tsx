"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { requestOtp } from "@/src/features/auth/services/authService";
import { PhoneNumberField } from "@/src/features/onboarding/components/PhoneNumberField";
import { OnboardingScreenSkeleton } from "@/src/features/onboarding/components/OnboardingScreenSkeleton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { createOtpExpiresAt } from "@/src/features/onboarding/lib/otp-timer";
import {
  clearOnboardingComplete,
  readOnboardingDraft,
  writeOnboardingDraft,
} from "@/src/features/onboarding/lib/onboarding-storage";

function subscribe() {
  return () => undefined;
}

export default function RegisterPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [phone, setPhone] = useState(() => readOnboardingDraft().phone);
  const [phoneDisplay, setPhoneDisplay] = useState(
    () => readOnboardingDraft().phoneDisplay,
  );
  const [fullName, setFullName] = useState(() => readOnboardingDraft().fullName);
  const [agreedToTerms, setAgreedToTerms] = useState(
    () => readOnboardingDraft().agreedToTerms,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return <OnboardingScreenSkeleton />;
  }

  const canContinue =
    phone.trim().length >= 10 && fullName.trim().length >= 3 && agreedToTerms;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const otpResult = await requestOtp({
        channel: "whatsapp",
        countryCode: phoneDisplay.split(" ")[0] || "+62",
        fullName,
        phoneNumber: phone,
      });

      clearOnboardingComplete();
      writeOnboardingDraft({
        agreedToTerms,
        fullName,
        incomeSource: "",
        incomeSourceLabel: "",
        otpDeliveryMethod: otpResult.deliveryMethod,
        otpExpiresAt: createOtpExpiresAt(otpResult.expiresInSeconds),
        otpMaskedDestination: otpResult.maskedDestination,
        otpRequestId: otpResult.requestId,
        otpCode: "",
        phone,
        phoneDisplay,
        pin: "",
        workCategoryLabel: "",
        workLabel: "",
        workOther: "",
        workPlatformId: "",
        workType: "",
      });

      router.push("/onboard/verify");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kode OTP belum bisa dikirim. Coba lagi sebentar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      currentStep={1}
      description="Tidak perlu dokumen apapun. Cukup nomor HP."
      showProgress={false}
      title="Daftar Sekarang"
    >
      <form className="mt-4 grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">Nomor HP</span>
          <PhoneNumberField
            onChange={({ phone: nextPhone, phoneDisplay: nextDisplay }) => {
              setPhone(nextPhone);
              setPhoneDisplay(nextDisplay);
            }}
            value={phone}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-secondary" htmlFor="full-name">
            Nama Lengkap
          </label>
          <input
            className="h-14 rounded-[18px] border border-black/10 bg-white px-4 text-base font-medium text-secondary outline-none transition-colors placeholder:text-[0.92rem] placeholder:text-secondary/35 focus:border-primary"
            id="full-name"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Rudi Hartono"
            value={fullName}
          />
        </div>

        <label className="flex items-start gap-3 rounded-[18px] border border-black/8 bg-black/[0.02] px-4 py-4">
          <input
            checked={agreedToTerms}
            className="mt-0.5 h-5 w-5 rounded-md border-black/10 accent-primary"
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            type="checkbox"
          />
          <span className="text-sm leading-6 text-secondary/70">
            Saya setuju dengan{" "}
            <span className="font-semibold text-primary">Syarat & Ketentuan</span>{" "}
            serta{" "}
            <span className="font-semibold text-primary">Kebijakan Privasi</span>{" "}
            Sakutera. Data saya diproses sesuai UU PDP No. 27/2022.
          </span>
        </label>

        <div className="grid gap-3 pt-2">
          <PressButton
            className="min-h-13 w-full justify-center py-3 text-base"
            disabled={!canContinue || isSubmitting}
            type="submit"
            variant="primary"
          >
            {isSubmitting ? "Mengirim OTP..." : "Kirim Kode OTP"}
          </PressButton>
          {errorMessage ? (
            <p className="text-center text-sm font-medium text-red-500">{errorMessage}</p>
          ) : null}
          <p className="text-center text-sm font-medium text-secondary/50">
            Sudah punya akun?{" "}
            <Link className="text-primary" href="/login">
              Masuk
            </Link>
          </p>
        </div>
      </form>
    </OnboardingShell>
  );
}
