import { Container } from "@/src/shared/components/layout/Container";

const principles = [
  "Prosesnya mudah dipahami dari awal, tanpa istilah yang membingungkan.",
  "Fokusnya bukan sekadar mencatat, tapi membantu penghasilanmu tampil lebih jelas.",
  "Data tetap berada dalam alur yang bisa kamu kendalikan saat ingin membagikannya.",
];

export function LandingAboutSection() {
  return (
    <section className="bg-tertiary py-16 text-secondary sm:py-20" id="tentang">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="grid gap-3 lg:sticky lg:top-28">
          <h2 className="max-w-[12ch] text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[0.96] tracking-[-0.05em]">
            Bukan sekadar aplikasi catatan, tapi alat bantu kepercayaan.
          </h2>
        </div>

        <div className="grid gap-4">
          {principles.map((principle) => (
            <p className="max-w-[34rem] text-[1rem] leading-8 text-secondary/76" key={principle}>
              {principle}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
