import { AuthSessionGuard } from "@/src/features/auth/components/AuthSessionGuard";
import { DashboardBottomNav } from "@/src/features/dashboard/components/DashboardBottomNav";
import { InstalledAppGate } from "@/src/features/pwa/components/installed-app-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-secondary">
      <InstalledAppGate>
        <AuthSessionGuard />
        {children}
        <DashboardBottomNav />
      </InstalledAppGate>
    </div>
  );
}
