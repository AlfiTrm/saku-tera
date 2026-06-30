import { LandingNavbar } from "@/src/features/landing/components/LandingNavbar";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main className="grid min-h-[calc(100vh-92px)] place-items-center px-6 py-16">
        <h1 className="text-center text-[clamp(2.5rem,8vw,5.75rem)] font-bold leading-[0.96] tracking-[-0.05em] text-secondary">
          Ini landing nanti.
        </h1>
      </main>
    </>
  );
}
