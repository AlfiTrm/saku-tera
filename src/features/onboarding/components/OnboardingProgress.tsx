type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
        (step) => (
          <span
            className={
              step === currentStep
                ? "h-1.5 w-7 rounded-full bg-primary"
                : "h-1.5 w-7 rounded-full bg-black/10"
            }
            key={step}
          />
        ),
      )}
    </div>
  );
}
