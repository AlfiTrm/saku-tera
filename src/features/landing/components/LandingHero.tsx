"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingInstallButton } from "@/src/features/landing/components/LandingInstallButton";
import { Container } from "@/src/shared/components/layout/Container";

export function LandingHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    function updateScroll() {
      setScrollY(window.scrollY);
      ticking = false;
    }

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateScroll);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const backgroundOffset = Math.min(scrollY * 0.18, 96);
  const contentOffset = Math.min(scrollY * 0.1, 48);

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${backgroundOffset}px, 0) scale(1.08)` }}
      >
        <Image
          src="/landing/hero-bg.webp"
          alt=""
          fill
          className="absolute top-0 left-0 h-full w-full object-cover"
          priority
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,56,0.54)_0%,rgba(18,30,72,0.42)_46%,rgba(22,35,80,0.58)_100%)]"
        style={{ transform: `translate3d(0, ${backgroundOffset * 0.55}px, 0)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,23,56,0.18)_0%,rgba(23,23,56,0.08)_100%)]"
        style={{ transform: `translate3d(0, ${backgroundOffset * 0.3}px, 0)` }}
      />

      <Container className="relative pt-2 pb-14 sm:pt-4 sm:pb-16 lg:pt-6 lg:pb-20">
        <div
          className="grid gap-8 justify-items-center py-2 text-center lg:min-h-[31rem] lg:content-center"
          style={{ transform: `translate3d(0, ${contentOffset}px, 0)` }}
        >
          <div className="grid max-w-[46rem] gap-4 justify-items-center">
            <h1 className="max-w-[11ch] text-[clamp(2.45rem,7vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.06em] sm:leading-[0.94]">
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
