export const dashboardHomeResponseMock = {
  data: {
    summary: {
      active_days: 63,
      active_days_minimum: 30,
      estimated_monthly_income: "Rp 6.850.000",
      latest_daily_income: "Rp 285.000",
      month_label: "Jun 2026",
      monthly_growth: "+12%",
      risk_label: "Risiko rendah",
      trend_model: "Prophet ML",
    },
    transactions: [
      {
        amount: "+Rp 285.000",
        hash_preview: "c1a97d2...",
        icon: "solar:scooter-bold-duotone",
        id: "txn_01",
        meta: "Hari ini, 14:22",
        source: "Gojek - Ojol",
        status: "verified",
      },
      {
        amount: "+Rp 310.000",
        hash_preview: "9e2d4b1...",
        icon: "solar:scooter-bold-duotone",
        id: "txn_02",
        meta: "Kemarin, 19:05",
        source: "Gojek - Ojol",
        status: "verified",
      },
      {
        amount: "+Rp 195.000",
        hash_preview: "a37fb2c...",
        icon: "solar:pen-2-bold-duotone",
        id: "txn_03",
        meta: "27 Jun, 10:11",
        source: "Manual - Grab",
        status: "verified",
      },
    ],
    trend: [
      { amount: 165000, day: "1 Jun" },
      { amount: 248000, day: "6 Jun" },
      { amount: 196000, day: "12 Jun" },
      { amount: 286000, day: "18 Jun" },
      { amount: 228000, day: "24 Jun" },
      { amount: 310000, day: "29 Jun" },
    ],
  },
} as const;

export const dashboardLedgerResponseMock = {
  data: {
    filters: [
      { active: true, id: "all", label: "Semua" },
      { active: false, id: "month", label: "Bulan Ini" },
      { active: false, id: "quarter", label: "3 Bulan" },
      { active: false, id: "gojek", label: "Gojek" },
    ],
    integrity_label: "63 entri / Rantai Hash Valid",
    transactions: [
      {
        amount: "+Rp 285.000",
        hash_preview: "a37fb2cd1ed4f9a0b62cd3e1...",
        icon: "solar:scooter-bold-duotone",
        id: "ledger_01",
        meta: "29 Jun - 14:22 WIB",
        source: "Gojek - Ojol",
        status: "verified",
      },
      {
        amount: "+Rp 310.000",
        hash_preview: "9e2d4b1ad17e626d2b4a8c1...",
        icon: "solar:scooter-bold-duotone",
        id: "ledger_02",
        meta: "28 Jun - 19:05 WIB",
        source: "Gojek - Ojol",
        status: "verified",
      },
      {
        amount: "+Rp 195.000",
        hash_preview: "c1a97d2b50ca84f1e6b3d7...",
        icon: "solar:pen-2-bold-duotone",
        id: "ledger_03",
        meta: "27 Jun - 20:11 WIB",
        source: "Manual - Grab",
        status: "verified",
      },
      {
        amount: "+Rp 265.000",
        hash_preview: "4df51cb908cbf17b287e39...",
        icon: "solar:scooter-bold-duotone",
        id: "ledger_04",
        meta: "26 Jun - 15:45 WIB",
        source: "Gojek - Ojol",
        status: "verified",
      },
    ],
  },
} as const;

export const dashboardPassportResponseMock = {
  data: {
    active_passport: {
      emi_value: 6850000,
      income_passport_id: "passport_01",
      issued_at: "2026-06-29",
      passport_number: "SKT-2026-8R-2S773E1",
      period_label: "Apr-Jun 2026",
      period_type: "3_bulan",
      risk_level: "RENDAH",
    },
    eligibility: {
      days_of_data: 63,
      entries_verified: 63,
      is_eligible: true,
      min_required: 30,
    },
  },
} as const;

export const dashboardPassportPreviewResponseMock = {
  data: {
    emi_value: 6850000,
    period_end: "2026-06-30",
    period_label: "Apr-Jun",
    period_start: "2026-04-01",
    period_type: "3_bulan",
    risk_level: "RENDAH",
    risk_score: 0.15,
    stability_label: "STABIL",
    total_entries: 63,
    trend_change_pct: 12,
    trend_direction: "up",
  },
} as const;
