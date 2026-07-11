"use client";

import { usePathname } from "next/navigation";
import { AppBottomNav } from "@/src/shared/components/navigation";
import { getDashboardNavItems } from "@/src/features/dashboard/lib/navigation";

function getActiveTab(pathname: string) {
  if (pathname.startsWith("/dashboard/ledger")) {
    return "ledger" as const;
  }

  if (pathname.startsWith("/dashboard/passport")) {
    return "passport" as const;
  }

  if (pathname.startsWith("/dashboard/account")) {
    return "profile" as const;
  }

  return "home" as const;
}

export function DashboardBottomNav() {
  const pathname = usePathname();

  return <AppBottomNav items={getDashboardNavItems(getActiveTab(pathname))} />;
}
