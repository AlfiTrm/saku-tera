import { InstalledAppGate } from "@/src/features/pwa/components/installed-app-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(48,102,190,0.18),transparent_26%),linear-gradient(180deg,#171738_0%,#11212d_100%)] text-white">
      <InstalledAppGate>{children}</InstalledAppGate>
    </div>
  );
}
