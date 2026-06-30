export type PassportHistoryStatus = "valid" | "revoked";

export type PassportHistoryEntry = {
  accessSummary: string;
  badgeLabel: string;
  id: string;
  organization: string;
  status: PassportHistoryStatus;
  timestamp: string;
};
