"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InstallInstructions } from "@/src/features/pwa/components/InstallInstructions";
import { useInstallPrompt } from "@/src/features/pwa/hooks/useInstallPrompt";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { LandingMobileGateModal } from "./LandingMobileGateModal";

type LandingInstallButtonProps = {
  className?: string;
};

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
}

export function LandingInstallButton({ className }: LandingInstallButtonProps) {
  const router = useRouter();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isMobileGateOpen, setIsMobileGateOpen] = useState(false);
  const { isInstalled, isPromptAvailable, isStandaloneDisplay, platform, promptInstall } =
    useInstallPrompt();

  const label = isInstalled ? "Buka App" : "Daftar Gratis";

  async function handleClick() {
    if (isInstalled && isStandaloneDisplay) {
      router.push("/onboard");
      return;
    }

    if (!isMobileViewport()) {
      setIsMobileGateOpen(true);
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
        className={className ?? "shrink-0 px-4 py-2 text-sm sm:px-5"}
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

      <LandingMobileGateModal
        isOpen={isMobileGateOpen}
        onClose={() => setIsMobileGateOpen(false)}
      />
    </div>
  );
}
