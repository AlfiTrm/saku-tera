"use client";

import { useEffect, useState } from "react";
import { subscribeDashboardTransactionsUpdated } from "@/src/features/dashboard/lib/dashboard-events";
import { getDashboardLedgerData } from "@/src/features/dashboard/services/dashboardService";
import type {
  DashboardLedgerData,
  DashboardLedgerPeriod,
} from "@/src/features/dashboard/types/dashboardData";

type DashboardLedgerState = {
  data: DashboardLedgerData | null;
  error: string | null;
  isLoading: boolean;
};

export function useDashboardLedgerData() {
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardLedgerPeriod>("all");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [state, setState] = useState<DashboardLedgerState>({
    data: null,
    error: null,
    isLoading: true,
  });

  async function load() {
    try {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      const data = await getDashboardLedgerData({
        period: selectedPeriod,
        sourceId: selectedSourceId,
      });

      setState({
        data,
        error: null,
        isLoading: false,
      });
    } catch {
      setState({
        data: null,
        error: "Gagal memuat data ledger.",
        isLoading: false,
      });
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadOnMount() {
      try {
        const data = await getDashboardLedgerData({
          period: selectedPeriod,
          sourceId: selectedSourceId,
        });

        if (!isMounted) {
          return;
        }

        setState({
          data,
          error: null,
          isLoading: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          data: null,
          error: "Gagal memuat data ledger.",
          isLoading: false,
        });
      }
    }

    void loadOnMount();

    const unsubscribe = subscribeDashboardTransactionsUpdated(() => {
      if (!isMounted) {
        return;
      }

      void loadOnMount();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedPeriod, selectedSourceId]);

  return {
    ...state,
    selectedPeriod,
    selectedSourceId,
    setSelectedPeriod,
    setSelectedSourceId,
    reload: load,
  };
}
