import Image from "next/image";
import Link from "next/link";
import { LandingInstallButton } from "@/src/features/landing/components/LandingInstallButton";
import { Container } from "@/src/shared/components/layout/Container";

const navItems = [
  { label: "Fitur", href: "#fitur" },
  { label: "Tentang", href: "#tentang" },
  { label: "Lembaga Keuangan", href: "#lembaga-keuangan" },
];

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-secondary/8 bg-white/96 backdrop-blur-sm">
      <Container className="flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link className="shrink-0" href="/">
            <Image
              alt="SakuTera"
              className="h-auto w-[148px] sm:w-[164px]"
              height={34}
              priority
              src="/icons/sakutera-full.svg"
              style={{ height: "auto" }}
              width={164}
            />
          </Link>

          <nav className="hidden items-center gap-8 text-base font-semibold text-secondary lg:flex">
            {navItems.map((item) => (
              <Link
                className="transition-opacity duration-150 hover:opacity-75"
                key={item.label}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <LandingInstallButton className="shrink-0 px-3 py-2 text-xs sm:px-5 sm:text-sm" />
      </Container>
    </header>
  );
}
