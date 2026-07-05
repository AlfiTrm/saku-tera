import Image from "next/image";
import Link from "next/link";
import { Container } from "@/src/shared/components/layout/Container";

const footerLinks = [
  { href: "#fitur", label: "Fitur" },
  { href: "#tentang", label: "Tentang" },
  { href: "#lembaga-keuangan", label: "Lembaga Keuangan" },
];

export function LandingFooter() {
  return (
    <footer className="bg-white py-8 text-secondary">
      <Container className="flex flex-col gap-6 border-t border-secondary/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-3">
          <Link className="w-fit" href="/">
            <Image
              alt="SakuTera"
              className="h-auto w-[144px]"
              height={32}
              src="/icons/sakutera-full.svg"
              style={{ height: "auto" }}
              width={154}
            />
          </Link>
          <p className="max-w-[28rem] text-sm leading-6 text-secondary/66">
            Sakutera membantu pekerja informal mencatat, merapikan, dan menampilkan
            penghasilan dengan cara yang lebih jelas.
          </p>
        </div>

        <div className="grid gap-3 sm:justify-items-end">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-secondary/70">
            {footerLinks.map((link) => (
              <Link
                className="transition-opacity duration-150 hover:opacity-70"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-secondary/48">Sakutera 2026</p>
        </div>
      </Container>
    </footer>
  );
}
