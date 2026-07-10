type DashboardTab = "home" | "ledger" | "passport" | "profile";

export function getDashboardNavItems(activeTab: DashboardTab) {
  return [
    {
      href: "/dashboard",
      icon: "solar:home-2-bold",
      isActive: activeTab === "home",
      label: "Beranda",
    },
    {
      href: "/dashboard/ledger",
      icon: "solar:clipboard-list-bold",
      isActive: activeTab === "ledger",
      label: "Buku Kas",
    },
    {
      href: "/dashboard/passport",
      icon: "solar:wallet-money-bold",
      isActive: activeTab === "passport",
      label: "Passport",
    },
    {
      href: "/dashboard/account",
      icon: "solar:user-rounded-bold",
      isActive: activeTab === "profile",
      label: "Profil",
    },
  ];
}
