"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

type InstalledAppGateProps = {
  children: React.ReactNode;
};

function isInstalledAppMode() {
  const supportsStandaloneMedia = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;
  const supportsIosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return supportsStandaloneMedia || supportsIosStandalone;
}

function subscribe() {
  return () => {};
}

export function InstalledAppGate({ children }: InstalledAppGateProps) {
  const router = useRouter();
  const isInstalled = useSyncExternalStore(
    subscribe,
    isInstalledAppMode,
    () => false,
  );

  useEffect(() => {
    if (!isInstalled) {
      router.replace("/");
    }
  }, [isInstalled, router]);

  if (!isInstalled) {
    return null;
  }

  return children;
}
