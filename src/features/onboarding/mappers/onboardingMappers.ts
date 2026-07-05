import type { OnboardingDraft } from "@/src/features/onboarding/lib/onboarding-storage";
import type { OnboardingProfilePayload } from "@/src/features/onboarding/types/onboardingContract";

export function mapDraftToOnboardingPayload(
  draft: OnboardingDraft,
): OnboardingProfilePayload | null {
  if (!draft.workPlatformId || !draft.incomeSource) {
    return null;
  }

  return {
    incomeSourceType: draft.incomeSource,
    workPlatformId: draft.workPlatformId,
  };
}
