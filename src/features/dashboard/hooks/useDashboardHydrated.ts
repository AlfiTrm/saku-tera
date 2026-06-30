"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

export function useDashboardHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
