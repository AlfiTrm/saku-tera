"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { InstallInstructions } from "@/src/features/pwa/components/InstallInstructions";
import { useInstallPrompt } from "@/src/features/pwa/hooks/useInstallPrompt";

export function InstallAppButton() {
  const router = useRouter();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const { isInstalled, isPromptAvailable, isStandaloneDisplay, platform, promptInstall } =
    useInstallPrompt();

  const label = isInstalled ? "Buka App" : "Daftar Gratis";

  async function handleClick() {
    if (isInstalled && isStandaloneDisplay) {
      router.push("/onboard");
      return;
    }

    if (isPromptAvailable) {
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
          onClose={() => setIsInstructionsOpen(false)}
          platform={platform}
        />
      ) : null}
    </div>
  );
}
