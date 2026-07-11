"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const hasHandledAutoInstall = useRef(false);
  const {
    installExperience,
    isInstalled,
    isStandaloneDisplay,
    platform,
    promptInstall,
  } = useInstallPrompt();

  const label = isInstalled ? "Buka App" : "Install PWA";

  useEffect(() => {
    const shouldAutoInstall =
      new URLSearchParams(window.location.search).get("install") === "pwa" &&
      !hasHandledAutoInstall.current &&
      !isInstalled &&
      isMobileViewport();

    if (!shouldAutoInstall) {
      return;
    }

    hasHandledAutoInstall.current = true;
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);

    const timer = window.setTimeout(async () => {
      if (installExperience === "native-prompt") {
        const choice = await promptInstall();
        if (choice?.outcome === "dismissed") {
          setIsInstructionsOpen(true);
        }
        return;
      }

      setIsInstructionsOpen(true);
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [installExperience, isInstalled, promptInstall]);

  async function handleClick() {
    if (isInstalled && isStandaloneDisplay) {
      router.push("/onboard");
      return;
    }

    if (!isMobileViewport()) {
      setIsMobileGateOpen(true);
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
        className={className ?? "shrink-0 px-4 py-2 text-sm sm:px-5"}
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
          variant="modal"
        />
      ) : null}

      <LandingMobileGateModal
        isOpen={isMobileGateOpen}
        onClose={() => setIsMobileGateOpen(false)}
      />
    </div>
  );
}
