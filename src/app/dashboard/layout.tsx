import { InstalledAppGate } from "@/src/features/pwa/components/installed-app-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-secondary">
      <InstalledAppGate>{children}</InstalledAppGate>
    </div>
  );
}
