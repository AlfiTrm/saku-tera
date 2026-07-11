import { readAuthSession } from "@/src/features/auth/lib/auth-storage";
import { ApiError, apiRequest } from "@/src/shared/lib/api";
import type {
  GrantPassportAccessPayload,
  PassportAccessEntry,
  PassportAccessScope,
  PassportAccessStatus,
  PassportOrganization,
} from "@/src/features/dashboard/types/passportAccess";
import type {
  PassportHistoryEntry,
  PassportHistoryFilter,
  PassportHistoryStatus,
} from "@/src/features/dashboard/types/passportHistory";

type AccessConsentApi = {
  consent_id: string;
  data_scope: string[] | null;
  days_remaining: number;
  expires_at: string;
  granted_at: string;
  organization_name: string;
  organization_type: string;
  purpose: string;
  status: string;
  status_label: string;
};

type AccessLogApi = {
  access_log_id: string;
  accessed_at: string;
  consent_status: string;
  data_scope: string[] | null;
  note: string;
  organization_name: string;
  organization_type: string;
  status_label: string;
};

type OrganizationApi = {
  name: string;
  organization_id: string;
  type: string;
};

function getAuthorizationHeader() {
  const session = readAuthSession();

  if (!session?.accessToken) {
    throw new ApiError("Sesi login tidak ditemukan. Coba masuk ulang.", 401);
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

function mapOrganizationIcon(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("bank")) {
    return "solar:buildings-bold-duotone";
  }

  if (normalized.includes("fintech")) {
    return "solar:buildings-2-bold-duotone";
  }

  return "solar:buildings-3-bold-duotone";
}

function mapAccessBadgeTone(
  status: string,
  statusLabel: string,
  daysRemaining: number,
): PassportAccessStatus {
  const normalizedStatus = status.toLowerCase();
  const normalizedLabel = statusLabel.toLowerCase();

  if (normalizedStatus === "revoked" || normalizedLabel.includes("dicabut")) {
    return "revoked";
  }

  if (normalizedStatus === "expired" || normalizedLabel.includes("kedaluwarsa")) {
    return "expired";
  }

  if (normalizedLabel.includes("hr lagi") || daysRemaining <= 3) {
    return "expiring";
  }

  return "active";
}

function mapAccessExpiresText(consent: AccessConsentApi) {
  if (!consent.expires_at || consent.days_remaining === 0) {
    const fullScopeSelected = (consent.data_scope ?? []).includes("Akses penuh");
    return fullScopeSelected ? "Akses penuh tanpa batas waktu" : "Tanpa batas waktu";
  }

  return `Berlaku s/d ${consent.expires_at} (${consent.days_remaining} hari)`;
}

function mapAccessEntry(consent: AccessConsentApi): PassportAccessEntry {
  const badgeTone = mapAccessBadgeTone(
    consent.status,
    consent.status_label,
    consent.days_remaining,
  );

  return {
    badgeLabel: consent.status_label,
    badgeTone,
    expiresText: mapAccessExpiresText(consent),
    icon: mapOrganizationIcon(consent.organization_type),
    id: consent.consent_id,
    issuedText: `Diberikan ${consent.granted_at}`,
    metrics: consent.data_scope ?? [],
    organization: consent.organization_name,
    organizationType: consent.organization_type,
    purpose: consent.purpose || undefined,
    showActions: badgeTone === "active" || badgeTone === "expiring",
  };
}

function mapHistoryStatus(status: string): PassportHistoryStatus {
  return status.toLowerCase() === "revoked" ? "revoked" : "valid";
}

function mapHistoryEntry(log: AccessLogApi): PassportHistoryEntry {
  return {
    accessSummary: log.note,
    badgeLabel: log.status_label,
    id: log.access_log_id,
    metrics: log.data_scope ?? [],
    organization: log.organization_name,
    organizationType: log.organization_type,
    status: mapHistoryStatus(log.consent_status),
    timestamp: log.accessed_at,
  };
}

function normalizeGrantScope(scopes: PassportAccessScope[]) {
  if (scopes.includes("full")) {
    return ["full"];
  }

  return scopes;
}

export async function getPassportAccessConsents(): Promise<PassportAccessEntry[]> {
  const response = await apiRequest<{ consents: AccessConsentApi[] | null }>(
    "/passport/access",
    {
      headers: getAuthorizationHeader(),
      method: "GET",
    },
  );

  return (response.data.consents ?? []).map(mapAccessEntry);
}

export async function getPassportAccessLogs(
  filter: PassportHistoryFilter,
): Promise<PassportHistoryEntry[]> {
  const query = filter ? `?filter=${filter}` : "";
  const response = await apiRequest<{ logs: AccessLogApi[] | null }>(
    `/passport/access/logs${query}`,
    {
      headers: getAuthorizationHeader(),
      method: "GET",
    },
  );

  return (response.data.logs ?? []).map(mapHistoryEntry);
}

export async function getPassportOrganizations(): Promise<PassportOrganization[]> {
  const response = await apiRequest<OrganizationApi[]>("/organizations", {
    headers: getAuthorizationHeader(),
    method: "GET",
  });

  return response.data.map((organization) => ({
    id: organization.organization_id,
    name: organization.name,
    type: organization.type,
  }));
}

export async function grantPassportAccess(payload: GrantPassportAccessPayload) {
  await apiRequest<null>("/passport/access", {
    body: JSON.stringify({
      data_scope: normalizeGrantScope(payload.dataScope),
      expires_in_days: payload.expiresInDays,
      organization_id: payload.organizationId,
      purpose: payload.purpose || "",
    }),
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    method: "POST",
  });
}

export async function revokePassportAccess(consentId: string) {
  await apiRequest<null>(`/passport/access/${consentId}/revoke`, {
    headers: getAuthorizationHeader(),
    method: "PATCH",
  });
}
