"use client";

import type { PassportHistoryEntry } from "@/src/features/dashboard/types/passportHistory";

type PassportHistoryViewModel = {
  filters: Array<{ active: boolean; label: string }>;
  historyEntries: PassportHistoryEntry[];
};

const filters = [
  { active: true, label: "Semua" },
  { active: false, label: "Income Passport" },
];

const historyEntries: PassportHistoryEntry[] = [
  {
    accessSummary: "Kamu sudah diberitahu",
    badgeLabel: "Valid",
    id: "history-1",
    organization: "Koperasi Sejahtera Jawa",
    status: "valid",
    timestamp: "29 Jun 2026 · 14:32 WIB",
  },
  {
    accessSummary: "Akses pertama · EMI + Tren + Risiko",
    badgeLabel: "Valid",
    id: "history-2",
    organization: "Koperasi Sejahtera Jawa",
    status: "valid",
    timestamp: "15 Jun 2026 · 09:15 WIB",
  },
  {
    accessSummary: "Akses penuh · Penilaian kredit motor",
    badgeLabel: "Valid",
    id: "history-3",
    organization: "PT BPR Sentosa Digital",
    status: "valid",
    timestamp: "10 Jun 2026 · 16:44 WIB",
  },
  {
    accessSummary: "Akses dicabut oleh kamu · 8 Jun",
    badgeLabel: "Dicabut",
    id: "history-4",
    organization: "Bank XYZ Leasing",
    status: "revoked",
    timestamp: "5 Jun 2026 · 11:20 WIB",
  },
];

export function usePassportHistoryViewModel(): PassportHistoryViewModel {
  return {
    filters,
    historyEntries,
  };
}
