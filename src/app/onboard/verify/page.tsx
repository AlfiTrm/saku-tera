"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { writeAuthSession } from "@/src/features/auth/lib/auth-storage";
import { requestOtp, verifyOtp } from "@/src/features/auth/services/authService";
import { OnboardingScreenSkeleton } from "@/src/features/onboarding/components/OnboardingScreenSkeleton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { OtpInput } from "@/src/features/onboarding/components/OtpInput";
import {
  createOtpExpiresAt,
  formatOtpCountdown,
  getRemainingOtpSeconds,
} from "@/src/features/onboarding/lib/otp-timer";
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
  const [phoneDisplay, setPhoneDisplay] = useState(
    () =>
      readOnboardingDraft().otpMaskedDestination ||
      readOnboardingDraft().phoneDisplay ||
      readOnboardingDraft().phone,
  );
  const [deliveryMethod, setDeliveryMethod] = useState(
    () => readOnboardingDraft().otpDeliveryMethod || "whatsapp",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingOtpSeconds(readOnboardingDraft().otpExpiresAt),
  );

  useEffect(() => {
    const draft = readOnboardingDraft();

    if (!draft.phone || !draft.otpRequestId) {
      router.replace("/onboard/register");
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds(getRemainingOtpSeconds(readOnboardingDraft().otpExpiresAt));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  if (!isHydrated) {
    return <OnboardingScreenSkeleton />;
  }

  function getNextRoute() {
    const draft = readOnboardingDraft();

    if (!draft.pin) {
      return "/onboard/pin";
    }

    if (draft.workPlatformId && draft.incomeSource) {
      return "/dashboard";
    }

    if (draft.workPlatformId) {
      return "/onboard/income-source";
    }

    return "/onboard/work";
  }

  async function handleVerify() {
    const draft = readOnboardingDraft();

    if (
      otpCode.length !== 6 ||
      !draft.otpRequestId ||
      isSubmitting ||
      remainingSeconds <= 0
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const verificationResult = await verifyOtp({
        otpCode,
        requestId: draft.otpRequestId,
      });

      writeOnboardingDraft({ otpCode });
      writeAuthSession(verificationResult.session);

      router.push(getNextRoute());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kode OTP belum valid. Coba cek lalu kirim ulang bila perlu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    const draft = readOnboardingDraft();

    if (!draft.phone || isResending || remainingSeconds > 0) {
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage("");

      const otpResult = await requestOtp({
        channel: "whatsapp",
        countryCode: draft.phoneDisplay.split(" ")[0] || "+62",
        fullName: draft.fullName,
        phoneNumber: draft.phone,
      });

      writeOnboardingDraft({
        otpCode: "",
        otpDeliveryMethod: otpResult.deliveryMethod,
        otpExpiresAt: createOtpExpiresAt(otpResult.expiresInSeconds),
        otpMaskedDestination: otpResult.maskedDestination,
        otpRequestId: otpResult.requestId,
      });

      setOtpCode("");
      setDeliveryMethod(otpResult.deliveryMethod);
      setPhoneDisplay(otpResult.maskedDestination);
      setRemainingSeconds(otpResult.expiresInSeconds);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kode OTP belum bisa dikirim ulang. Coba lagi sebentar.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <OnboardingShell
      backHref="/onboard/register"
      currentStep={2}
      description={`Kode 6 digit dikirim ke ${phoneDisplay || "+62 812-***-7890"} via ${deliveryMethod === "sms" ? "SMS" : "WhatsApp"}`}
      showProgress={false}
      title="Cek SMS kamu"
    >
      <div className="mt-4 grid gap-5">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/8 text-primary">
          <Icon className="h-6 w-6" icon="solar:chat-round-dots-bold-duotone" />
        </span>

        <OtpInput onChange={setOtpCode} value={otpCode} />

        <div className="flex items-center justify-between gap-3 text-sm text-secondary/45">
          <span className="rounded-full bg-black/[0.03] px-3 py-2">
            {remainingSeconds > 0
              ? `${formatOtpCountdown(remainingSeconds)} tersisa`
              : "Kode OTP kedaluwarsa"}
          </span>
          <button
            className="min-h-11 font-medium disabled:cursor-not-allowed disabled:opacity-45"
            disabled={remainingSeconds > 0 || isResending}
            onClick={handleResendCode}
            type="button"
          >
            {isResending
              ? "Mengirim ulang..."
              : remainingSeconds > 0
                ? "Tunggu dulu"
                : "Kirim ulang kode"}
          </button>
        </div>

        <PressButton
          className="mt-2 min-h-13 w-full justify-center py-3 text-base"
          disabled={otpCode.length !== 6 || isSubmitting || remainingSeconds <= 0}
          onClick={handleVerify}
          variant="primary"
        >
          {isSubmitting ? "Memverifikasi..." : "Verifikasi"}
        </PressButton>

        {errorMessage ? (
          <p className="text-center text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <p className="text-center text-sm leading-6 text-secondary/38">
          Tidak menerima kode? Pastikan sinyal HP aktif dan coba kirim ulang
          setelah timer habis.
        </p>
      </div>
    </OnboardingShell>
  );
}
