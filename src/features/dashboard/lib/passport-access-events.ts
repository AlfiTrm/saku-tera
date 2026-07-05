"use client";

const PASSPORT_ACCESS_UPDATED_EVENT = "sakutera:passport-access-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

export function notifyPassportAccessUpdated() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(PASSPORT_ACCESS_UPDATED_EVENT));
}

export function subscribePassportAccessUpdated(onInvalidate: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(
    PASSPORT_ACCESS_UPDATED_EVENT,
    onInvalidate as EventListener,
  );

  return () => {
    window.removeEventListener(
      PASSPORT_ACCESS_UPDATED_EVENT,
      onInvalidate as EventListener,
    );
  };
}
