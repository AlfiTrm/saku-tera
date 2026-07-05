export type OnboardingProfilePayload = {
  incomeSourceType: string;
  workPlatformId: string;
};

export type OnboardingProfileResponse = {
  completedAt: string;
  nextRoute: "/dashboard";
  onboardingId: string;
};

export type WorkPlatform = {
  id: string;
  name: string;
};

export type WorkCategory = {
  id: string;
  name: string;
  platforms: WorkPlatform[];
};

export type IncomeSourceOption = {
  description: string;
  isAvailable: boolean;
  label: string;
  type: string;
};
