"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { InstallInstructions } from "@/src/features/pwa/components/InstallInstructions";
import { useInstallPrompt } from "@/src/features/pwa/hooks/useInstallPrompt";

export function InstallAppButton() {
  const router = useRouter();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const {
    installExperience,
    isInstalled,
    isStandaloneDisplay,
    platform,
    promptInstall,
  } = useInstallPrompt();

  const label = isInstalled ? "Buka App" : "Install PWA";

  async function handleClick() {
    if (isInstalled && isStandaloneDisplay) {
      router.push("/onboard");
      return;
    }

    if (installExperience === "native-prompt") {
      const choice = await promptInstall();
      if (choice?.outcome === "dismissed") {
        setIsInstructionsOpen(true);
      }
      return;
    }

    setIsInstructionsOpen(true);
  }

  return (
    <div className="relative">
      <PressButton
        className="shrink-0 px-4 py-2 text-sm sm:px-5"
        onClick={handleClick}
        variant="primary"
      >
        {label}
      </PressButton>

      {isInstructionsOpen ? (
        <InstallInstructions
          isInstalled={isInstalled}
          mode={installExperience === "ios-open-safari" ? "ios-open-safari" : "platform"}
          onClose={() => setIsInstructionsOpen(false)}
          platform={platform}
        />
      ) : null}
    </div>
  );
}
