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
      <main className="pt-[5.25rem]">{children}</main>
      <LandingFooter />
    </>
  );
}
