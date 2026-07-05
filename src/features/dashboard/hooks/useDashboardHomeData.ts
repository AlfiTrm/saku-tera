"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeDashboardTransactionsUpdated } from "@/src/features/dashboard/lib/dashboard-events";
import { getDashboardHomeData } from "@/src/features/dashboard/services/dashboardService";
import type { DashboardHomeData } from "@/src/features/dashboard/types/dashboardData";

type DashboardHomeState = {
  data: DashboardHomeData | null;
  error: string | null;
  isLoading: boolean;
};

export function useDashboardHomeData() {
  const [state, setState] = useState<DashboardHomeState>({
    data: null,
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

      const data = await getDashboardHomeData();

      setState({
        data,
        error: null,
        isLoading: false,
      });
    } catch {
      setState((currentState) => ({
        data: currentState.data,
        error: "Gagal memuat ringkasan dashboard.",
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOnMount() {
      try {
        const data = await getDashboardHomeData();

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

        setState((currentState) => ({
          data: currentState.data,
          error: "Gagal memuat ringkasan dashboard.",
          isLoading: false,
        }));
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
  }, []);

  return {
    ...state,
    reload: load,
  };
}
