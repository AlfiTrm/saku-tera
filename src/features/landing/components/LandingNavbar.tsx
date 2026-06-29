import Image from "next/image";
import Link from "next/link";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { Container } from "@/src/shared/components/layout/Container";

const navItems = [
  { label: "Fitur", href: "#fitur" },
  { label: "Tentang", href: "#tentang" },
  { label: "Lembaga Keuangan", href: "#lembaga-keuangan" },
];

export function LandingNavbar() {
  return (
    <header className="w-full border-b border-black/10 bg-white">
      <Container className="flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link className="shrink-0" href="/">
            <Image
              alt="SakuTera"
              height={34}
              priority
              src="/icons/sakutera-full.svg"
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

        <PressButton
          className="shrink-0 px-4 py-2 text-sm sm:px-5"
          href="#daftar"
          variant="primary"
        >
          Daftar Gratis
        </PressButton>
      </Container>
    </header>
  );
}
