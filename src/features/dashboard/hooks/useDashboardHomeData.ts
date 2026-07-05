"use client";

import { useEffect, useState } from "react";
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

  async function load() {
    try {
      const data = await getDashboardHomeData();

      setState({
        data,
        error: null,
        isLoading: false,
      });
    } catch {
      setState({
        data: null,
        error: "Gagal memuat ringkasan dashboard.",
        isLoading: false,
      });
    }
  }

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

        setState({
          data: null,
          error: "Gagal memuat ringkasan dashboard.",
          isLoading: false,
        });
      }
    }

    void loadOnMount();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...state,
    reload: load,
  };
}
