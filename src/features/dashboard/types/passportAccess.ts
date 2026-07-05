export type PassportAccessStatus =
  | "active"
  | "expiring"
  | "revoked"
  | "expired";

export type PassportAccessScope = "emi" | "stability" | "risk" | "full";

export type PassportAccessEntry = {
  badgeLabel: string;
  badgeTone: PassportAccessStatus;
  expiresText: string;
  icon: string;
  id: string;
  issuedText: string;
  metrics: string[];
  organization: string;
  organizationType: string;
  purpose?: string;
  showActions?: boolean;
};

export type PassportOrganization = {
  id: string;
  name: string;
  type: string;
};

export type GrantPassportAccessPayload = {
  dataScope: PassportAccessScope[];
  expiresInDays: number;
  organizationId: string;
  purpose?: string;
};
