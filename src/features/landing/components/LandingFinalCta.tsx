import { LandingInstallButton } from "@/src/features/landing/components/LandingInstallButton";
import { Container } from "@/src/shared/components/layout/Container";

export function LandingFinalCta() {
  return (
    <section className="bg-secondary py-16 text-white sm:py-20">
      <Container className="grid gap-6 text-center">
        <div className="grid gap-3">
          <h2 className="mx-auto max-w-[12ch] text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[0.96] tracking-[-0.05em]">
            Masuk ke Sakutera dan mulai bangun rekam penghasilanmu.
          </h2>
        </div>

        <div className="mx-auto">
          <LandingInstallButton className="px-5 py-3 text-sm sm:px-6" />
        </div>
      </Container>
    </section>
  );
}
