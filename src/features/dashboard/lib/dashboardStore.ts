import { mapDashboardPassportData } from "@/src/features/dashboard/mappers/dashboardMappers";
import {
  dashboardPassportPreviewResponseMock,
  dashboardPassportResponseMock,
} from "@/src/features/dashboard/mocks/dashboard.mock";
import type { DashboardPassportData } from "@/src/features/dashboard/types/dashboardData";

function clonePassportData(data: DashboardPassportData): DashboardPassportData {
  return {
    activePassport: data.activePassport ? { ...data.activePassport } : null,
    issuePeriods: data.issuePeriods.map((period) => ({ ...period })),
    metrics: data.metrics.map((metric) => ({ ...metric })),
    summary: { ...data.summary },
  };
}

const passportData = mapDashboardPassportData(
  dashboardPassportResponseMock,
  dashboardPassportPreviewResponseMock.data,
);

export function readDashboardPassportData() {
  return clonePassportData(passportData);
}
