import Link from "next/link";
import { LandingInstallButton } from "@/src/features/landing/components/LandingInstallButton";
import { Container } from "@/src/shared/components/layout/Container";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing/hero-bg.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,56,0.54)_0%,rgba(18,30,72,0.42)_46%,rgba(22,35,80,0.58)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,23,56,0.18)_0%,rgba(23,23,56,0.08)_100%)]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 justify-items-center py-8 text-center lg:min-h-[35rem] lg:content-center">
          <div className="grid max-w-[46rem] gap-4 justify-items-center">
            <h1 className="max-w-[10ch] text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.06em]">
              Catat, verifikasi, dan tunjukkan penghasilanmu.
            </h1>
            <p className="max-w-[32rem] text-[0.98rem] leading-7 text-white/82 sm:text-[1.05rem]">
              Sakutera membantu pekerja informal merapikan penghasilan agar lebih
              mudah dicatat, diverifikasi, dan dibagikan saat dibutuhkan.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <LandingInstallButton className="px-5 py-3 text-sm sm:px-6" />
            <Link
              className="text-sm font-semibold text-white/82 transition-opacity hover:opacity-80"
              href="#fitur"
            >
              Lihat cara kerjanya
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
