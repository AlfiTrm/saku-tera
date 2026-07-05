export type DashboardSummary = {
  activeDays: number;
  activeDaysMinimum: number;
  estimatedMonthlyIncome: string;
  hasForecast: boolean;
  latestDailyIncome: string;
  monthLabel: string;
  monthlyGrowth: string;
  riskLabel: string;
  trendModel: string;
};

export type DashboardTrendPoint = {
  amount: number;
  day: string;
};

export type DashboardTransaction = {
  amount: string;
  amountValue: number;
  description?: string;
  hashPreview: string;
  icon: string;
  id: string;
  meta: string;
  source: string;
  status: "verified" | "pending";
};

export type IncomeSourceOption = {
  icon: string;
  id: string;
  label: string;
};

export type CreateIncomeEntryPayload = {
  amount: number;
  description?: string;
  sourceId: string;
  transactionDate: string;
};

export type IncomeEntryMethod = "manual" | "document";

export type IncomeDocumentType =
  | "invoice"
  | "salary-slip"
  | "bank-proof"
  | "unknown";

export type IncomeDocumentExtraction = {
  amount?: number;
  confidence: "high" | "medium" | "low";
  description?: string;
  documentType: IncomeDocumentType;
  fileName: string;
  sourceHint?: string;
};

export type DashboardLedgerFilter = {
  active: boolean;
  id: string;
  label: string;
};

export type DashboardLedgerPeriod = "all" | "bulan_ini" | "3_bulan";

export type DashboardPassportMetric = {
  label: string;
  tone?: "default" | "success";
  value: string;
};

export type DashboardPassportPeriodType = "3_bulan" | "6_bulan" | "12_bulan";

export type DashboardPassportPeriod = {
  id: DashboardPassportPeriodType;
  label: string;
  range: string;
  selected: boolean;
};

export type ActivePassport = {
  emi: string;
  id: string;
  issuedAt: string;
  issuerLabel: string;
  periodLabel: string;
  periodType?: DashboardPassportPeriodType;
  riskLabel: string;
  statusLabel: string;
  verificationCode: string;
};

export type DashboardPassportSummary = {
  activeDaysLabel: string;
  hasActivePassport: boolean;
  headline: string;
  isEligible: boolean;
  progressRatio: number;
  progressValueLabel: string;
  supportingCopy: string;
};

export type DashboardHomeData = {
  sourceOptions: IncomeSourceOption[];
  summary: DashboardSummary;
  transactions: DashboardTransaction[];
  trend: DashboardTrendPoint[];
  userFullName: string;
};

export type DashboardLedgerData = {
  entries: DashboardTransaction[];
  filters: DashboardLedgerFilter[];
  integrityLabel: string;
  selectedPeriod: DashboardLedgerPeriod;
  selectedSourceId: string;
  sourceOptions: IncomeSourceOption[];
};

export type DashboardPassportData = {
  activePassport: ActivePassport | null;
  issuePeriods: DashboardPassportPeriod[];
  metrics: DashboardPassportMetric[];
  summary: DashboardPassportSummary;
};
