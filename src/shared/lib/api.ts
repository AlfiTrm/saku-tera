import { notifyAuthInvalidated } from "@/src/features/auth/lib/auth-events";

type ApiStatus = {
  code: number;
  isSuccess: boolean;
};

type ApiEnvelope<TData> = {
  data: TData;
  message: string;
  status: ApiStatus;
};

export class ApiError extends Error {
  code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_BASE_URL belum diatur.", 500);
  }

  return baseUrl.replace(/\/+$/, "");
}

export function normalizePhoneNumber(phoneNumber: string, countryCode = "+62") {
  const digits = phoneNumber.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `${countryCode.replace("+", "")}${digits.slice(1)}`;
  }

  if (digits.startsWith(countryCode.replace("+", ""))) {
    return digits;
  }

  return `${countryCode.replace("+", "")}${digits}`;
}

export async function apiRequest<TData>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<TData>> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<TData> | null;

  if (!response.ok || !payload?.status?.isSuccess) {
    const error = new ApiError(
      payload?.message || "Terjadi kesalahan saat menghubungi server.",
      payload?.status?.code || response.status || 500,
    );

    if (error.code === 401) {
      notifyAuthInvalidated();
    }

    throw error;
  }

  return payload;
}
