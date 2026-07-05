export type PassportHistoryStatus = "valid" | "revoked";
export type PassportHistoryFilter = "" | "income_passport";

export type PassportHistoryEntry = {
  accessSummary: string;
  badgeLabel: string;
  id: string;
  metrics: string[];
  organization: string;
  organizationType: string;
  status: PassportHistoryStatus;
  timestamp: string;
};
