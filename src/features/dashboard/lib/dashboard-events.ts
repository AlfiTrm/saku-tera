"use client";

const DASHBOARD_TRANSACTIONS_UPDATED_EVENT =
  "sakutera:dashboard-transactions-updated";
const DASHBOARD_TRANSACTIONS_UPDATED_AT_KEY =
  "sakutera:dashboard-transactions-updated-at";

function isBrowser() {
  return typeof window !== "undefined";
}

export function notifyDashboardTransactionsUpdated() {
  if (!isBrowser()) {
    return;
  }

  const updatedAt = String(Date.now());
  window.localStorage.setItem(
    DASHBOARD_TRANSACTIONS_UPDATED_AT_KEY,
    updatedAt,
  );
  window.dispatchEvent(
    new CustomEvent(DASHBOARD_TRANSACTIONS_UPDATED_EVENT, {
      detail: { updatedAt },
    }),
  );
}

export function subscribeDashboardTransactionsUpdated(
  onInvalidate: () => void,
) {
  if (!isBrowser()) {
    return () => undefined;
  }

  function handleUpdate() {
    onInvalidate();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === DASHBOARD_TRANSACTIONS_UPDATED_AT_KEY) {
      onInvalidate();
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      onInvalidate();
    }
  }

  window.addEventListener(
    DASHBOARD_TRANSACTIONS_UPDATED_EVENT,
    handleUpdate as EventListener,
  );
  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", handleUpdate);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener(
      DASHBOARD_TRANSACTIONS_UPDATED_EVENT,
      handleUpdate as EventListener,
    );
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", handleUpdate);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
