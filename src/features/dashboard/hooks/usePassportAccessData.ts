"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  notifyPassportAccessUpdated,
  subscribePassportAccessUpdated,
} from "@/src/features/dashboard/lib/passport-access-events";
import {
  getPassportAccessConsents,
  getPassportOrganizations,
  grantPassportAccess,
  revokePassportAccess,
} from "@/src/features/dashboard/services/passportAccessService";
import type {
  GrantPassportAccessPayload,
  PassportAccessEntry,
  PassportOrganization,
} from "@/src/features/dashboard/types/passportAccess";

type PassportAccessState = {
  entries: PassportAccessEntry[];
  error: string | null;
  isLoading: boolean;
  organizations: PassportOrganization[];
};

export function usePassportAccessData() {
  const [state, setState] = useState<PassportAccessState>({
    entries: [],
    error: null,
    isLoading: true,
    organizations: [],
  });
  const [isGranting, setIsGranting] = useState(false);
  const [revokingConsentId, setRevokingConsentId] = useState("");

  const load = useCallback(async () => {
    try {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      const [entries, organizations] = await Promise.all([
        getPassportAccessConsents(),
        getPassportOrganizations(),
      ]);

      setState({
        entries,
        error: null,
        isLoading: false,
        organizations,
      });
    } catch (error) {
      setState({
        entries: [],
        error:
          error instanceof Error
            ? error.message
            : "Daftar akses belum bisa dimuat.",
        isLoading: false,
        organizations: [],
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOnMount() {
      if (!isMounted) {
        return;
      }

      await load();
    }

    void loadOnMount();

    const unsubscribe = subscribePassportAccessUpdated(() => {
      if (!isMounted) {
        return;
      }

      void load();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [load]);

  const activeEntries = useMemo(
    () =>
      state.entries.filter(
        (entry) => entry.badgeTone === "active" || entry.badgeTone === "expiring",
      ),
    [state.entries],
  );

  const otherEntries = useMemo(
    () =>
      state.entries.filter(
        (entry) => entry.badgeTone === "revoked" || entry.badgeTone === "expired",
      ),
    [state.entries],
  );

  async function handleGrantAccess(payload: GrantPassportAccessPayload) {
    try {
      setIsGranting(true);
      await grantPassportAccess(payload);
      notifyPassportAccessUpdated();
      await load();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Akses baru belum bisa diberikan.");
    } finally {
      setIsGranting(false);
    }
  }

  async function handleRevokeAccess(consentId: string) {
    try {
      setRevokingConsentId(consentId);
      await revokePassportAccess(consentId);
      notifyPassportAccessUpdated();
      await load();
    } finally {
      setRevokingConsentId("");
    }
  }

  return {
    activeEntries,
    error: state.error,
    isGranting,
    isLoading: state.isLoading,
    organizations: state.organizations,
    otherEntries,
    reload: load,
    revokingConsentId,
    grantAccess: handleGrantAccess,
    revokeAccess: handleRevokeAccess,
  };
}
