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
type InstallBrowser = "safari" | "chromium" | "other";
type InstallExperience =
  | "native-prompt"
  | "ios-safari-manual"
  | "ios-open-safari"
  | "browser-menu-manual";

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

function detectBrowser(): InstallBrowser {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isSafari =
    /safari/.test(userAgent) &&
    !/crios|fxios|edgios|opios|mercury/.test(userAgent);
  const isChromiumBrowser = /chrome|chromium|edg|opr|brave/.test(userAgent);

  if (isSafari) {
    return "safari";
  }

  if (isChromiumBrowser) {
    return "chromium";
  }

  return "other";
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
  const [browser, setBrowser] = useState<InstallBrowser>(detectBrowser);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setPlatform(detectPlatform());
      setBrowser(detectBrowser());
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
      setBrowser(detectBrowser());
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

  let installExperience: InstallExperience = "browser-menu-manual";

  if (platform === "ios" && browser === "safari") {
    installExperience = "ios-safari-manual";
  } else if (platform === "ios") {
    installExperience = "ios-open-safari";
  } else if (deferredPrompt !== null) {
    installExperience = "native-prompt";
  }

  return {
    browser,
    isInstalled,
    installExperience,
    isPromptAvailable: deferredPrompt !== null,
    isStandaloneDisplay: isStandaloneDisplay(),
    platform,
    promptInstall,
  };
}
