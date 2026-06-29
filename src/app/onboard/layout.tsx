import { InstalledAppGate } from "@/src/features/pwa/components/installed-app-gate";

export default function OnboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(217,240,222,0.18),transparent_28%),linear-gradient(180deg,#0f1728_0%,#171738_100%)] text-white">
      <InstalledAppGate>{children}</InstalledAppGate>
    </div>
  );
}
