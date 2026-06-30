type DashboardTab = "home" | "ledger" | "passport" | "profile";

export function getDashboardNavItems(activeTab: DashboardTab) {
  return [
    {
      href: "/dashboard",
      icon: "solar:home-2-bold-duotone",
      isActive: activeTab === "home",
      label: "Beranda",
    },
    {
      href: "/dashboard/ledger",
      icon: "solar:clipboard-list-bold-duotone",
      isActive: activeTab === "ledger",
      label: "Buku Kas",
    },
    {
      href: "/dashboard/passport",
      icon: "solar:wallet-money-bold-duotone",
      isActive: activeTab === "passport",
      label: "Passport",
    },
    {
      href: "/dashboard",
      icon: "solar:user-rounded-bold-duotone",
      isActive: activeTab === "profile",
      label: "Profil",
    },
  ];
}
