"use client";

import { useEffect, useState } from "react";

const INSTALL_STATE_KEY = "sakutera:pwa-installed";

type InstallPromptOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: InstallPromptOutcome;
    platform: string;
  }>;
};

type InstallPlatform = "ios" | "android" | "desktop";

function isStandaloneDisplay() {
  if (typeof window === "undefined") {
    return false;
  }

  const isMediaStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return isMediaStandalone || isIosStandalone;
}

function detectPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") {
    return "desktop";
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  const isAndroidDevice = /android/.test(userAgent);

  if (isIosDevice) {
    return "ios";
  }

  if (isAndroidDevice) {
    return "android";
  }

  return "desktop";
}

function readInstalledState() {
  if (typeof window === "undefined") {
    return false;
  }

  if (isStandaloneDisplay()) {
    return true;
  }

  return window.localStorage.getItem(INSTALL_STATE_KEY) === "true";
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(readInstalledState);
  const [platform, setPlatform] = useState<InstallPlatform>(detectPlatform);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setPlatform(detectPlatform());
    };

    const handleInstalled = () => {
      window.localStorage.setItem(INSTALL_STATE_KEY, "true");
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const handleDisplayModeChange = () => {
      const installed = readInstalledState();
      if (installed) {
        window.localStorage.setItem(INSTALL_STATE_KEY, "true");
      }
      setIsInstalled(installed);
      setPlatform(detectPlatform());
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    window.addEventListener("appinstalled", handleInstalled);
    mediaQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", handleInstalled);
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) {
      return null;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      window.localStorage.setItem(INSTALL_STATE_KEY, "true");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    return choice;
  }

  return {
    isInstalled,
    isPromptAvailable: deferredPrompt !== null,
    isStandaloneDisplay: isStandaloneDisplay(),
    platform,
    promptInstall,
  };
}
