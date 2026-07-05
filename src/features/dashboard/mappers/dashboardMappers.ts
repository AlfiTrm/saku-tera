import type {
  ActivePassport,
  DashboardHomeData,
  DashboardLedgerData,
  DashboardLedgerPeriod,
  DashboardPassportData,
  DashboardPassportMetric,
  DashboardPassportPeriod,
  DashboardPassportPeriodType,
  DashboardPassportSummary,
  DashboardSummary,
  DashboardTransaction,
  DashboardTrendPoint,
} from "@/src/features/dashboard/types/dashboardData";

type TransactionResponse = {
  amount: number;
  category?: string;
  hash_prefix: string;
  is_verified?: boolean;
  source_name: string;
  source_provider: string;
  transaction_date: string;
  transaction_time?: string;
  transaction_id: string;
};

type HomeResponse = {
  data: {
    forecast: {
      confidence: string;
      days_of_data: number;
      emi_value: number;
      forecast_total: number;
      is_data_sufficient: boolean;
      model_name: string;
      month_to_date_income: number;
      risk_level: string;
      trend_change_pct: number;
      trend_direction: string;
      transaction_count: number;
    } | null;
    recent_transactions: readonly TransactionResponse[] | null;
    today_income: number;
    trend_data: ReadonlyArray<{ amount: number; date: string }>;
    user_full_name: string;
    valid_chain_count: number;
  };
};

type LedgerResponse = {
  data: {
    summary: {
      chain_valid: boolean;
      total_entries: number;
    };
    total: number;
    transactions: readonly TransactionResponse[];
  };
};

type PassportResponse = {
  data: {
    active_passport: {
      emi_value: number;
      income_passport_id: string;
      issued_at: string;
      passport_number: string;
      period_type: DashboardPassportPeriodType;
      period_label: string;
      risk_level: string;
    } | null;
    eligibility: {
      days_of_data: number;
      entries_verified: number;
      is_eligible: boolean;
      min_required: number;
    };
  };
};

type PassportPreviewResponse = {
  data: {
    emi_value: number;
    period_end: string;
    period_label: string;
    period_start: string;
    period_type: DashboardPassportPeriodType;
    risk_level: string;
    risk_score: number;
    stability_label: string;
    total_entries: number;
    trend_change_pct: number;
    trend_direction: string;
  };
};

function formatShortCurrency(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })} Jt`;
  }

  return formatCurrency(value);
}

function formatPassportDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function mapPassportPeriodLabel(period: DashboardPassportPeriodType) {
  if (period === "3_bulan") return "3 Bulan";
  if (period === "6_bulan") return "6 Bulan";
  return "12 Bulan";
}

function createPassportPeriods(
  preview: PassportPreviewResponse["data"] | null,
): DashboardPassportPeriod[] {
  const periods: DashboardPassportPeriodType[] = ["3_bulan", "6_bulan", "12_bulan"];

  return periods.map((period) => ({
    id: period,
    label: mapPassportPeriodLabel(period),
    range:
      preview?.period_type === period
        ? preview.period_label
        : period === "3_bulan"
          ? "3 bulan"
          : period === "6_bulan"
            ? "6 bulan"
            : "12 bulan",
    selected: preview?.period_type === period,
  }));
}

function createPassportMetrics(
  preview: PassportPreviewResponse["data"] | null,
): DashboardPassportMetric[] {
  if (!preview) {
    return [];
  }

  const trendValue = `${preview.stability_label} ${formatTrendChange(preview.trend_change_pct)}`;

  return [
    { label: "Estimasi Gaji Bulanan", value: formatShortCurrency(preview.emi_value) },
    { label: "Tren Stabilitas", tone: "success", value: trendValue },
    { label: "Skor Risiko", tone: "success", value: preview.risk_level },
    { label: "Total Entri", value: String(preview.total_entries) },
  ];
}

function createPassportSummary(
  response: PassportResponse["data"],
): DashboardPassportSummary {
  const progressRatio =
    response.eligibility.min_required > 0
      ? Math.min(response.eligibility.days_of_data / response.eligibility.min_required, 1)
      : 0;

  return {
    activeDaysLabel: "Data aktif",
    hasActivePassport: Boolean(response.active_passport),
    headline: response.eligibility.is_eligible
      ? "Kamu memenuhi syarat!"
      : "Belum memenuhi syarat",
    isEligible: response.eligibility.is_eligible,
    progressRatio,
    progressValueLabel: `${response.eligibility.days_of_data} hari / min. ${response.eligibility.min_required} hari`,
    supportingCopy: `${response.eligibility.days_of_data} hari data aktif - ${response.eligibility.entries_verified} entri terverifikasi`,
  };
}

function mapActivePassport(
  response: PassportResponse["data"]["active_passport"],
): ActivePassport | null {
  if (!response) {
    return null;
  }

  return {
    emi: formatShortCurrency(response.emi_value),
    id: response.income_passport_id,
    issuedAt: formatPassportDate(response.issued_at),
    issuerLabel: "sakutera",
    periodLabel: response.period_label,
    periodType: response.period_type,
    riskLabel: response.risk_level,
    statusLabel: "Aktif",
    verificationCode: response.passport_number,
  };
}

export function mapDashboardPassportData(
  response: PassportResponse,
  preview: PassportPreviewResponse["data"] | null,
): DashboardPassportData {
  return {
    activePassport: mapActivePassport(response.data.active_passport),
    issuePeriods: createPassportPeriods(preview),
    metrics: createPassportMetrics(preview),
    summary: createPassportSummary(response.data),
  };
}

function mapTransaction(response: TransactionResponse): DashboardTransaction {
  const sourceLabel = `${response.source_name} - ${response.source_provider}`;

  return {
    amount: `+Rp ${response.amount.toLocaleString("id-ID")}`,
    amountValue: response.amount,
    description: response.category || undefined,
    hashPreview: response.hash_prefix,
    icon: mapTransactionIcon(response.source_name, response.source_provider),
    id: response.transaction_id,
    meta: formatTransactionMeta(
      response.transaction_date,
      response.category,
      response.transaction_time,
    ),
    source: sourceLabel,
    status: response.is_verified === false ? "pending" : "verified",
  };
}

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatTrendChange(percentage: number) {
  return `${percentage > 0 ? "+" : ""}${percentage.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  })}%`;
}

function formatMonthLabel(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTransactionMeta(
  dateString: string,
  category?: string,
  transactionTime?: string,
) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));

  if (transactionTime) {
    return `${formattedDate} - ${transactionTime} WIB`;
  }

  if (category) {
    return `${formattedDate} - ${category}`;
  }

  return formattedDate;
}

function mapTransactionIcon(sourceName: string, sourceProvider: string) {
  const normalized = `${sourceName} ${sourceProvider}`.toLowerCase();

  if (normalized.includes("gojek") || normalized.includes("gopay")) {
    return "solar:map-point-bold-duotone";
  }

  if (normalized.includes("grab") || normalized.includes("ovo")) {
    return "solar:ticket-sale-bold-duotone";
  }

  if (normalized.includes("shopee")) {
    return "solar:bag-5-bold-duotone";
  }

  if (normalized.includes("tokopedia")) {
    return "solar:shop-2-bold-duotone";
  }

  return "solar:wallet-money-bold-duotone";
}

function mapSummary(response: HomeResponse["data"]): DashboardSummary {
  const forecast = response.forecast;

  return {
    activeDays: forecast?.days_of_data ?? 0,
    activeDaysMinimum: 30,
    estimatedMonthlyIncome: formatCurrency(forecast?.forecast_total ?? 0),
    hasForecast: Boolean(forecast),
    latestDailyIncome: formatCurrency(response.today_income),
    monthLabel:
      response.trend_data.at(-1)?.date
        ? formatMonthLabel(response.trend_data.at(-1)!.date)
        : formatMonthLabel(new Date().toISOString()),
    monthlyGrowth: forecast ? formatTrendChange(forecast.trend_change_pct) : "0%",
    riskLabel: forecast?.risk_level ?? "Belum ada data",
    trendModel: forecast?.model_name ?? "Belum tersedia",
  };
}

function mapTrendPoint(response: {
  amount: number;
  date: string;
}): DashboardTrendPoint {
  const dayLabel = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
  }).format(new Date(response.date));

  return {
    amount: response.amount,
    day: dayLabel,
  };
}


export function mapDashboardHomeData(response: HomeResponse): DashboardHomeData {
  const transactions = response.data.recent_transactions ?? [];

  return {
    sourceOptions: [],
    summary: mapSummary(response.data),
    transactions: transactions.map(mapTransaction),
    trend: response.data.trend_data.map(mapTrendPoint),
    userFullName: response.data.user_full_name,
  };
}

export function mapDashboardLedgerData(
  response: LedgerResponse,
  filters: DashboardLedgerData["filters"],
  selectedPeriod: DashboardLedgerPeriod,
  selectedSourceId: string,
  sourceOptions: DashboardLedgerData["sourceOptions"],
): DashboardLedgerData {
  return {
    entries: response.data.transactions.map(mapTransaction),
    filters,
    integrityLabel: `${response.data.summary.total_entries} entri / ${
      response.data.summary.chain_valid ? "Rantai Hash Valid" : "Rantai Hash Bermasalah"
    }`,
    selectedPeriod,
    selectedSourceId,
    sourceOptions,
  };
}
