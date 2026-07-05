export type WorkType =
  | "driver"
  | "courier"
  | "freelancer"
  | "merchant"
  | "other"
  | "";

export type IncomeSource = "platform" | "manual" | "ewallet" | "";

export type OnboardingDraft = {
  agreedToTerms: boolean;
  fullName: string;
  incomeSource: IncomeSource;
  incomeSourceLabel: string;
  pin: string;
  otpDeliveryMethod: "sms" | "whatsapp" | "";
  otpExpiresAt: string;
  otpMaskedDestination: string;
  otpRequestId: string;
  otpCode: string;
  phone: string;
  phoneDisplay: string;
  workCategoryLabel: string;
  workLabel: string;
  workOther: string;
  workPlatformId: string;
  workType: WorkType;
};

const ONBOARDING_STORAGE_KEY = "sakutera:onboarding-draft";
const ONBOARDING_COMPLETE_KEY = "sakutera:onboarding-complete";

export const emptyOnboardingDraft: OnboardingDraft = {
  agreedToTerms: false,
  fullName: "",
  incomeSource: "",
  incomeSourceLabel: "",
  pin: "",
  otpDeliveryMethod: "",
  otpExpiresAt: "",
  otpMaskedDestination: "",
  otpRequestId: "",
  otpCode: "",
  phone: "",
  phoneDisplay: "",
  workCategoryLabel: "",
  workLabel: "",
  workOther: "",
  workPlatformId: "",
  workType: "",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readOnboardingDraft(): OnboardingDraft {
  if (!isBrowser()) {
    return emptyOnboardingDraft;
  }

  const storedValue = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

  if (!storedValue) {
    return emptyOnboardingDraft;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<OnboardingDraft>;
    return {
      ...emptyOnboardingDraft,
      ...parsedValue,
    };
  } catch {
    return emptyOnboardingDraft;
  }
}

export function writeOnboardingDraft(nextValue: Partial<OnboardingDraft>) {
  if (!isBrowser()) {
    return;
  }

  const currentDraft = readOnboardingDraft();
  const mergedDraft = {
    ...currentDraft,
    ...nextValue,
  };

  window.localStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    JSON.stringify(mergedDraft),
  );
}

export function markOnboardingComplete() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
}

export function clearOnboardingComplete() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
}

export function isOnboardingComplete() {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";
}
