"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { OnboardingShell } from "@/src/features/onboarding/components/OnboardingShell";
import { WorkOptionCard } from "@/src/features/onboarding/components/WorkOptionCard";
import {
  readOnboardingDraft,
  writeOnboardingDraft,
  type WorkType,
} from "@/src/features/onboarding/lib/onboarding-storage";
import { getWorkCategories } from "@/src/features/onboarding/services/onboardingService";
import type { WorkCategory } from "@/src/features/onboarding/types/onboardingContract";

function subscribe() {
  return () => undefined;
}

const categoryIconMap: Record<string, string> = {
  Freelancer: "solar:code-square-bold-duotone",
  "Kurir Online": "solar:delivery-bold-duotone",
  "Pedagang UMKM": "solar:shop-2-bold-duotone",
  "Pekerjaan Lainnya": "solar:case-round-bold-duotone",
  "Pengemudi Ojol": "solar:map-point-wave-bold-duotone",
};

function mapCategoryToWorkType(categoryName: string): WorkType {
  if (categoryName === "Pengemudi Ojol") return "driver";
  if (categoryName === "Kurir Online") return "courier";
  if (categoryName === "Freelancer") return "freelancer";
  if (categoryName === "Pedagang UMKM") return "merchant";
  if (categoryName === "Pekerjaan Lainnya") return "other";
  return "";
}

export default function WorkPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [initialPlatformId] = useState(
    () => readOnboardingDraft().workPlatformId,
  );
  const [selectedPlatformId, setSelectedPlatformId] = useState(initialPlatformId);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const nextCategories = await getWorkCategories();

        if (!isMounted) {
          return;
        }

        setCategories(nextCategories);

        if (initialPlatformId) {
          const matchedCategory = nextCategories.find((category) =>
            category.platforms.some((platform) => platform.id === initialPlatformId),
          );

          if (matchedCategory) {
            setSelectedCategoryId(matchedCategory.id);
            return;
          }
        }

        const defaultCategory = nextCategories.find(
          (category) => category.name !== "Pekerjaan Lainnya",
        );

        if (defaultCategory) {
          setSelectedCategoryId(defaultCategory.id);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Daftar pekerjaan belum bisa dimuat.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, [initialPlatformId, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  const primaryCategories = categories
    .filter((category) => category.name !== "Pekerjaan Lainnya")
    .slice(0, 4);
  const otherCategory =
    categories.find((category) => category.name === "Pekerjaan Lainnya") ?? null;
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null;
  const canContinue = selectedPlatformId !== "";

  function handleSelectCategory(category: WorkCategory) {
    setSelectedCategoryId(category.id);

    const currentPlatformBelongsToCategory = category.platforms.some(
      (platform) => platform.id === selectedPlatformId,
    );

    if (currentPlatformBelongsToCategory) {
      return;
    }

    if (category.platforms.length === 1) {
      setSelectedPlatformId(category.platforms[0].id);
      return;
    }

    setSelectedPlatformId("");
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    const selectedCategory = categories.find((category) =>
      category.platforms.some((platform) => platform.id === selectedPlatformId),
    );
    const selectedPlatform = selectedCategory?.platforms.find(
      (platform) => platform.id === selectedPlatformId,
    );

    if (!selectedCategory || !selectedPlatform) {
      return;
    }

    writeOnboardingDraft({
      workCategoryLabel: selectedCategory.name,
      workLabel: `${selectedCategory.name} - ${selectedPlatform.name}`,
      workOther: "",
      workPlatformId: selectedPlatform.id,
      workType: mapCategoryToWorkType(selectedCategory.name),
    });

    router.push("/onboard/income-source");
  }

  return (
    <OnboardingShell
      backHref="/onboard/verify"
      currentStep={1}
      description="Ini membantu kami menyesuaikan pengalamanmu"
      title="Kamu bekerja sebagai apa?"
      totalSteps={3}
    >
      <div className="mt-4 grid gap-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="min-h-32 rounded-[22px] border border-black/8 bg-white"
                key={index}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {primaryCategories.map((category) => (
                <WorkOptionCard
                  description={`${category.platforms.length} platform tersedia`}
                  icon={
                    <Icon
                      className="h-5 w-5"
                      icon={
                        categoryIconMap[category.name] ||
                        "solar:case-round-bold-duotone"
                      }
                    />
                  }
                  isSelected={selectedCategoryId === category.id}
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                  title={category.name}
                />
              ))}
            </div>

            {otherCategory ? (
              <button
                className={`flex min-h-14 items-center justify-between rounded-[18px] border px-4 text-left text-base font-medium transition-colors ${
                  selectedCategoryId === otherCategory.id
                    ? "border-primary bg-primary/4 text-secondary"
                    : "border-black/10 bg-white text-secondary/55"
                }`}
                onClick={() => handleSelectCategory(otherCategory)}
                type="button"
              >
                <span>{otherCategory.name}...</span>
                <span>&rsaquo;</span>
              </button>
            ) : null}

            {selectedCategory ? (
              <section className="grid gap-3">
                <div className="grid gap-1">
                  <h2 className="text-sm font-semibold text-secondary/62">
                    Pilih platform
                  </h2>
                  <p className="text-sm leading-6 text-secondary/48">
                    {selectedCategory.name}
                  </p>
                </div>

                <div className="grid gap-2">
                  {selectedCategory.platforms.map((platform) => {
                    const isSelected = selectedPlatformId === platform.id;

                    return (
                      <button
                        className={`flex min-h-14 items-center justify-between rounded-[18px] border px-4 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/4"
                            : "border-black/10 bg-white"
                        }`}
                        key={platform.id}
                        onClick={() => setSelectedPlatformId(platform.id)}
                        type="button"
                      >
                        <span className="text-sm font-semibold text-secondary">
                          {platform.name}
                        </span>
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-black/15 bg-white"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        )}

        {errorMessage ? (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="mt-2 w-full justify-center py-3 text-base"
          disabled={!canContinue || isLoading}
          onClick={handleContinue}
          variant="primary"
        >
          Lanjutkan
        </PressButton>
      </div>
    </OnboardingShell>
  );
}
