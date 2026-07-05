"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { subscribePassportAccessUpdated } from "@/src/features/dashboard/lib/passport-access-events";
import { getPassportAccessLogs } from "@/src/features/dashboard/services/passportAccessService";
import type {
  PassportHistoryEntry,
  PassportHistoryFilter,
} from "@/src/features/dashboard/types/passportHistory";

type PassportHistoryState = {
  entries: PassportHistoryEntry[];
  error: string | null;
  isLoading: boolean;
};

export function usePassportHistoryData() {
  const [selectedFilter, setSelectedFilter] = useState<PassportHistoryFilter>("");
  const [state, setState] = useState<PassportHistoryState>({
    entries: [],
    error: null,
    isLoading: true,
  });

  const load = useCallback(async () => {
    try {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      const entries = await getPassportAccessLogs(selectedFilter);

      setState({
        entries,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      setState({
        entries: [],
        error:
          error instanceof Error
            ? error.message
            : "Riwayat akses belum bisa dimuat.",
        isLoading: false,
      });
    }
  }, [selectedFilter]);

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

  const filters = useMemo(
    () => [
      { active: selectedFilter === "", label: "Semua", value: "" as PassportHistoryFilter },
      {
        active: selectedFilter === "income_passport",
        label: "Income Passport",
        value: "income_passport" as PassportHistoryFilter,
      },
    ],
    [selectedFilter],
  );

  return {
    error: state.error,
    filters,
    historyEntries: state.entries,
    isLoading: state.isLoading,
    selectedFilter,
    setSelectedFilter,
  };
}
