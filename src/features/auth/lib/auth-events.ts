const AUTH_INVALIDATED_EVENT = "sakutera:auth-invalidated";

function isBrowser() {
  return typeof window !== "undefined";
}

export function notifyAuthInvalidated() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT));
}

export function subscribeAuthInvalidated(onInvalidate: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(AUTH_INVALIDATED_EVENT, onInvalidate);

  return () => {
    window.removeEventListener(AUTH_INVALIDATED_EVENT, onInvalidate);
  };
}
