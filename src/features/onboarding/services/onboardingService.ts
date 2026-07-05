import { readAuthSession } from "@/src/features/auth/lib/auth-storage";
import { apiRequest, ApiError } from "@/src/shared/lib/api";
import type {
  IncomeSourceOption,
  OnboardingProfilePayload,
  OnboardingProfileResponse,
  WorkCategory,
} from "@/src/features/onboarding/types/onboardingContract";

type WorkCategoriesResponseData = {
  categories: Array<{
    name: string;
    platforms: Array<{
      name: string;
      work_platform_id: string;
    }>;
    work_category_id: string;
  }>;
};

type IncomeSourcesResponseData = {
  sources: Array<{
    description: string;
    is_available: boolean;
    label: string;
    type: string;
  }>;
};

function getAuthorizationHeader() {
  const session = readAuthSession();

  if (!session?.accessToken) {
    throw new ApiError("Sesi login belum tersedia. Coba verifikasi ulang OTP.", 401);
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

export async function getWorkCategories(): Promise<WorkCategory[]> {
  const response = await apiRequest<WorkCategoriesResponseData>(
    "/onboarding/work-categories",
    {
      headers: getAuthorizationHeader(),
      method: "GET",
    },
  );

  return response.data.categories.map((category) => ({
    id: category.work_category_id,
    name: category.name,
    platforms: category.platforms.map((platform) => ({
      id: platform.work_platform_id,
      name: platform.name,
    })),
  }));
}

export async function getIncomeSources(): Promise<IncomeSourceOption[]> {
  const response = await apiRequest<IncomeSourcesResponseData>(
    "/onboarding/income-sources",
    {
      headers: getAuthorizationHeader(),
      method: "GET",
    },
  );

  return response.data.sources.map((source) => ({
    description: source.description,
    isAvailable: source.is_available,
    label: source.label,
    type: source.type,
  }));
}

export async function submitOnboardingProfile(
  payload: OnboardingProfilePayload,
): Promise<OnboardingProfileResponse> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthorizationHeader(),
  };

  await apiRequest<{ message: string }>("/onboarding/work-platform", {
    body: JSON.stringify({
      work_platform_id: payload.workPlatformId,
    }),
    headers,
    method: "POST",
  });

  await apiRequest<{ message: string }>("/onboarding/income-source", {
    body: JSON.stringify({
      income_source_type: payload.incomeSourceType,
    }),
    headers,
    method: "POST",
  });

  return {
    completedAt: new Date().toISOString(),
    nextRoute: "/dashboard",
    onboardingId: `onboarding_${payload.workPlatformId}`,
  };
}
