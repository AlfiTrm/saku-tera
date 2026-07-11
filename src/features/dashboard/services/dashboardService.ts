import { readAuthSession } from "@/src/features/auth/lib/auth-storage";
import {
  mapDashboardHomeData,
  mapDashboardLedgerData,
  mapDashboardPassportData,
} from "@/src/features/dashboard/mappers/dashboardMappers";
import { createFallbackExtraction } from "@/src/features/dashboard/lib/ocrResponse";
import type {
  CreateIncomeEntryPayload,
  DashboardHomeData,
  DashboardLedgerData,
  DashboardLedgerPeriod,
  DashboardPassportData,
  DashboardPassportPeriodType,
  IncomeDocumentExtraction,
  IncomeSourceOption,
} from "@/src/features/dashboard/types/dashboardData";
import { ApiError, apiRequest } from "@/src/shared/lib/api";

type DashboardApiResponse = {
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
  recent_transactions: Array<{
    amount: number;
    category: string;
    hash_prefix: string;
    source_name: string;
    source_provider: string;
    transaction_date: string;
    transaction_id: string;
  }> | null;
  today_income: number;
  trend_data: Array<{
    amount: number;
    date: string;
  }>;
  user_full_name: string;
  valid_chain_count: number;
};

type RecentTransactionsResponse = {
  total: number;
  transactions: Array<{
    amount: number;
    category: string;
    hash_prefix: string;
    source_name: string;
    source_provider: string;
    transaction_date: string;
    transaction_id: string;
  }>;
};

type TransactionSourcesResponse = {
  sources: Array<{
    name: string;
    provider: string;
    transaction_source_id: string;
  }>;
};

type LedgerResponse = {
  summary: {
    chain_valid: boolean;
    total_entries: number;
  };
  total: number;
  transactions: Array<{
    amount: number;
    hash_prefix: string;
    is_verified: boolean;
    source_name: string;
    source_provider: string;
    transaction_date: string;
    transaction_id: string;
    transaction_time: string;
  }>;
};

type PassportResponse = {
  active_passport: {
    emi_value: number;
    income_passport_id: string;
    issued_at: string;
    passport_number: string;
    period_label: string;
    period_type: DashboardPassportPeriodType;
    risk_level: string;
  } | null;
  eligibility: {
    days_of_data: number;
    entries_verified: number;
    is_eligible: boolean;
    min_required: number;
  };
};

type PassportPreviewResponse = {
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

function getAuthorizationHeaders() {
  const session = readAuthSession();

  if (!session?.accessToken) {
    throw new ApiError("Sesi login tidak ditemukan. Coba masuk ulang.", 401);
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

function mapSourceIcon(name: string, provider: string) {
  const normalized = `${name} ${provider}`.toLowerCase();

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

function mapSourceOptions(
  response: TransactionSourcesResponse,
): IncomeSourceOption[] {
  return response.sources.map((source) => ({
    icon: mapSourceIcon(source.name, source.provider),
    id: source.transaction_source_id,
    label: `${source.name} - ${source.provider}`,
  }));
}

export async function getTransactionSourceOptions(): Promise<IncomeSourceOption[]> {
  const response = await apiRequest<TransactionSourcesResponse>(
    "/transactions/sources",
    {
      headers: getAuthorizationHeaders(),
      method: "GET",
    },
  );

  return mapSourceOptions(response.data);
}

export async function getDashboardHomeData(): Promise<DashboardHomeData> {
  const dashboardResponse = await apiRequest<DashboardApiResponse>("/dashboard", {
    headers: getAuthorizationHeaders(),
    method: "GET",
  });

  const sourceOptions = await getTransactionSourceOptions().catch(
    () => [] as IncomeSourceOption[],
  );

  const recentTransactions =
    dashboardResponse.data.recent_transactions &&
    dashboardResponse.data.recent_transactions.length > 0
      ? dashboardResponse.data.recent_transactions
      : await apiRequest<RecentTransactionsResponse>("/transactions?limit=3", {
          headers: getAuthorizationHeaders(),
          method: "GET",
        })
          .then((response) => response.data.transactions)
          .catch(() => []);

  return {
    ...mapDashboardHomeData({
      ...dashboardResponse,
      data: {
        ...dashboardResponse.data,
        recent_transactions: recentTransactions,
      },
    }),
    sourceOptions,
  };
}

export async function getDashboardLedgerData({
  period = "all",
  sourceId = "",
}: {
  period?: DashboardLedgerPeriod;
  sourceId?: string;
} = {}): Promise<DashboardLedgerData> {
  const queryParams = new URLSearchParams();

  if (period !== "all") {
    queryParams.set("period", period);
  }

  if (sourceId) {
    queryParams.set("source_id", sourceId);
  }

  const ledgerPath = queryParams.size > 0 ? `/ledger?${queryParams.toString()}` : "/ledger";

  const [ledgerResponse, sourceOptions] = await Promise.all([
    apiRequest<LedgerResponse>(ledgerPath, {
      headers: getAuthorizationHeaders(),
      method: "GET",
    }),
    getTransactionSourceOptions(),
  ]);

  const periodFilters = [
    {
      active: period === "all",
      id: "all",
      label: "Semua",
    },
    {
      active: period === "bulan_ini",
      id: "bulan_ini",
      label: "Bulan Ini",
    },
    {
      active: period === "3_bulan",
      id: "3_bulan",
      label: "3 Bulan",
    },
  ];

  return {
    ...mapDashboardLedgerData(
      ledgerResponse,
      periodFilters,
      period,
      sourceId,
      sourceOptions,
    ),
    sourceOptions,
  };
}

export async function getDashboardPassportData({
  period = "3_bulan",
}: {
  period?: DashboardPassportPeriodType;
} = {}): Promise<DashboardPassportData> {
  const passportResponse = await apiRequest<PassportResponse>("/passport", {
    headers: getAuthorizationHeaders(),
    method: "GET",
  });

  let previewResponse: PassportPreviewResponse | null = null;
  let previewError: string | null = null;

  try {
    const previewParams = new URLSearchParams({ period });
    const previewPayload = await apiRequest<PassportPreviewResponse>(
      `/passport/preview?${previewParams.toString()}`,
      {
        headers: getAuthorizationHeaders(),
        method: "GET",
      },
    );

    previewResponse = previewPayload.data;
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 400) {
      throw error;
    }

    previewError = error.message;
  }

  return mapDashboardPassportData(
    passportResponse,
    previewResponse,
    period,
    previewError,
  );
}

export async function issueIncomePassport(period: DashboardPassportPeriodType) {
  const response = await apiRequest<{
    emi_value: number;
    income_passport_id: string;
    issued_at: string;
    passport_number: string;
    period_label: string;
    period_type: DashboardPassportPeriodType;
    risk_level: string;
  }>("/passport", {
    body: JSON.stringify({ period }),
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    method: "POST",
  });

  return response.data;
}

export async function submitIncomeEntry(payload: CreateIncomeEntryPayload) {
  const response = await apiRequest<{
    amount: number;
    current_hash: string;
    message: string;
    status: string;
    transaction_id: string;
  }>("/transactions", {
    body: JSON.stringify({
      amount: payload.amount,
      description: payload.description,
      transaction_date: payload.transactionDate,
      transaction_source_id: payload.sourceId,
    }),
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeaders(),
    },
    method: "POST",
  });

  return response.data;
}

export async function extractIncomeDocument(
  file: File,
): Promise<IncomeDocumentExtraction> {
  const normalizedName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const supportedImageTypes = new Set([
    "image/heic",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);
  const isPdf =
    normalizedName.endsWith(".pdf") || fileType === "application/pdf";
  const isImage =
    supportedImageTypes.has(fileType) ||
    /\.(png|jpe?g|webp|heic)$/i.test(normalizedName);

  if (!isPdf && !isImage) {
    throw new Error("invalid-file-type");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await fetch("/api/ocr/slip-gaji", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("ocr-request-failed");
    }

    return (await response.json()) as IncomeDocumentExtraction;
  } catch {
    return createFallbackExtraction(file);
  }
}
