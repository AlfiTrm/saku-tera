"use client";

import type { PassportAccessEntry } from "@/src/features/dashboard/types/passportAccess";

type PassportAccessViewModel = {
  activeEntries: PassportAccessEntry[];
  pendingEntries: PassportAccessEntry[];
};

const activeEntries: PassportAccessEntry[] = [
  {
    badgeLabel: "Aktif",
    badgeTone: "active",
    expiresText: "Berlaku s/d 29 Jul 2026 (30 hari)",
    icon: "solar:buildings-2-bold-duotone",
    id: "koperasi-sejahtera-jawa",
    issuedText: "Diberikan 29 Jun 2026",
    metrics: ["EMI", "Tren Stabilitas", "Risiko"],
    organization: "Koperasi Sejahtera Jawa",
    showActions: true,
  },
];

const pendingEntries: PassportAccessEntry[] = [
  {
    badgeLabel: "3 hr lagi",
    badgeTone: "expiring",
    expiresText: "Berlaku s/d 13 Jul 2026 - Akses penuh",
    icon: "solar:buildings-bold-duotone",
    id: "pt-bpr-sentosa-digital",
    issuedText: "Diberikan 10 Jun 2026",
    metrics: [],
    organization: "PT BPR Sentosa Digital",
  },
];

export function usePassportAccessViewModel(): PassportAccessViewModel {
  return {
    activeEntries,
    pendingEntries,
  };
}
