import {
  LandingFooter,
  LandingNavbar,
} from "@/src/features/landing/components";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar />
      <main className="pt-16 sm:pt-[4.5rem]">{children}</main>
      <LandingFooter />
    </>
  );
}
