"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDashboardPassportData,
  issueIncomePassport,
} from "@/src/features/dashboard/services/dashboardService";
import type {
  DashboardPassportData,
  DashboardPassportPeriodType,
} from "@/src/features/dashboard/types/dashboardData";

type DashboardPassportState = {
  data: DashboardPassportData | null;
  error: string | null;
  isLoading: boolean;
};

export function useDashboardPassportData() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardPassportPeriodType>("3_bulan");
  const [state, setState] = useState<DashboardPassportState>({
    data: null,
    error: null,
    isLoading: true,
  });
  const [isIssuing, setIsIssuing] = useState(false);

  const load = useCallback(async (period = selectedPeriod) => {
    try {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      const data = await getDashboardPassportData({ period });

      setState({
        data,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      setState((currentState) => ({
        data: currentState.data,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data passport.",
        isLoading: false,
      }));
    }
  }, [selectedPeriod]);

  async function handleIssuePassport() {
    if (isIssuing) {
      return;
    }

    try {
      setIsIssuing(true);
      await issueIncomePassport(selectedPeriod);
      await load(selectedPeriod);
      return true;
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        error:
          error instanceof Error
            ? error.message
            : "Passport belum bisa diterbitkan.",
      }));
      return false;
    } finally {
      setIsIssuing(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadOnMount() {
      try {
        const data = await getDashboardPassportData({ period: selectedPeriod });

        if (!isMounted) {
          return;
        }

        setState({
          data,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          data: currentState.data,
          error:
            error instanceof Error
              ? error.message
              : "Gagal memuat data passport.",
          isLoading: false,
        }));
      }
    }

    void loadOnMount();

    return () => {
      isMounted = false;
    };
  }, [selectedPeriod]);

  return {
    ...state,
    isIssuing,
    issuePassport: handleIssuePassport,
    reload: load,
    selectedPeriod,
    setSelectedPeriod,
  };
}
