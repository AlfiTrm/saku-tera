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
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  function selectPeriod(period: DashboardPassportPeriodType) {
    setIsPreviewLoading(true);
    setIssueError(null);
    setSelectedPeriod(period);
  }

  const load = useCallback(async (
    period = selectedPeriod,
    showPageLoader = true,
  ) => {
    try {
      if (showPageLoader) {
        setState((currentState) => ({
          ...currentState,
          error: null,
          isLoading: true,
        }));
      }

      const data = await getDashboardPassportData({ period });

      setState({
        data,
        error: null,
        isLoading: false,
      });
      return true;
    } catch (error) {
      setState((currentState) => ({
        data: currentState.data,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data passport.",
        isLoading: false,
      }));
      return false;
    }
  }, [selectedPeriod]);

  async function handleIssuePassport() {
    if (isIssuing) {
      return;
    }

    try {
      setIsIssuing(true);
      setIssueError(null);
      await issueIncomePassport(selectedPeriod);
      await load(selectedPeriod, false);
      return true;
    } catch (error) {
      setIssueError(
        error instanceof Error
          ? error.message
          : "Passport belum bisa diterbitkan.",
      );
      return false;
    } finally {
      setIsIssuing(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    setIsPreviewLoading(true);
    setIssueError(null);

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
      } finally {
        if (isMounted) {
          setIsPreviewLoading(false);
        }
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
    isPreviewLoading,
    issueError,
    issuePassport: handleIssuePassport,
    clearIssueError: () => setIssueError(null),
    reload: load,
    selectedPeriod,
    setSelectedPeriod: selectPeriod,
  };
}
