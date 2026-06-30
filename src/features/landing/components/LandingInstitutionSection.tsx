import { Container } from "@/src/shared/components/layout/Container";

const institutions = [
  "Koperasi dan lembaga pembiayaan",
  "Bank perkreditan rakyat",
  "Program verifikasi penghasilan",
];

export function LandingInstitutionSection() {
  return (
    <section className="bg-white py-16 sm:py-20" id="lembaga-keuangan">
      <Container className="grid gap-10">
        <div className="grid gap-3 lg:max-w-[46rem]">
          <h2 className="max-w-[14ch] text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[0.96] tracking-[-0.05em] text-secondary">
            Informasi yang lebih rapi membuat keputusan jadi lebih mudah.
          </h2>
          <p className="max-w-[42rem] text-[1rem] leading-7 text-secondary/68">
            Sakutera membantu menjembatani data penghasilan informal agar tampil lebih
            konsisten, lebih mudah dibaca, dan lebih siap diproses dalam alur yang
            membutuhkan verifikasi.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {institutions.map((institution, index) => (
            <article
              className={`rounded-[24px] px-5 py-6 ${
                index === 1 ? "bg-primary text-white" : "bg-secondary text-white"
              }`}
              key={institution}
            >
              <p className="text-sm font-semibold text-white/56">0{index + 1}</p>
              <p className="mt-5 max-w-[14ch] text-lg font-semibold leading-7">{institution}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
