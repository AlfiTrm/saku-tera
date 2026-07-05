import type { AuthSession } from "@/src/features/auth/types/auth";

const AUTH_SESSION_STORAGE_KEY = "sakutera:auth-session";
const AUTH_LOGIN_PHONE_STORAGE_KEY = "sakutera:auth-login-phone";
const AUTH_PENDING_PIN_SETUP_STORAGE_KEY = "sakutera:auth-pending-pin-setup";

type PendingPinSetup = {
  phone: string;
  sessionToken: string;
  source: "login" | "onboard";
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as AuthSession;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function readPendingLoginPhone() {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(AUTH_LOGIN_PHONE_STORAGE_KEY) || "";
}

export function writePendingLoginPhone(phone: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_LOGIN_PHONE_STORAGE_KEY, phone);
}

export function clearPendingLoginPhone() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_LOGIN_PHONE_STORAGE_KEY);
}

export function readPendingPinSetup(): PendingPinSetup | null {
  if (!isBrowser()) {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    AUTH_PENDING_PIN_SETUP_STORAGE_KEY,
  );

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as PendingPinSetup;
  } catch {
    return null;
  }
}

export function writePendingPinSetup(setup: PendingPinSetup) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    AUTH_PENDING_PIN_SETUP_STORAGE_KEY,
    JSON.stringify(setup),
  );
}

export function clearPendingPinSetup() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_PENDING_PIN_SETUP_STORAGE_KEY);
}
