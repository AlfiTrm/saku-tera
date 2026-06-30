"use client";

import { useSyncExternalStore } from "react";

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
  useSyncExternalStore(subscribe, isInstalledAppMode, () => false);

  return children;
}
