import { Container } from "@/src/shared/components/layout/Container";

const features = [
  {
    description:
      "Masukkan penghasilan harian dengan format yang sederhana dan cepat dipakai dari ponsel.",
    title: "Pencatatan yang ringan",
  },
  {
    description:
      "Riwayat transaksi tersusun rapi sehingga lebih mudah dilihat ulang dan dibagikan saat dibutuhkan.",
    title: "Riwayat yang jelas",
  },
  {
    description:
      "Income Passport membuat gambaran penghasilan lebih mudah dipahami oleh pihak lain yang relevan.",
    title: "Bukti yang siap dipakai",
  },
];

export function LandingFeatureGrid() {
  return (
    <section className="bg-white py-16 sm:py-20" id="fitur">
      <Container className="grid gap-10">
        <div className="grid gap-3 lg:max-w-[42rem]">
          <h2 className="max-w-[13ch] text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[0.96] tracking-[-0.05em] text-secondary">
            Dibuat untuk alur yang langsung terasa berguna.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              className={`rounded-[28px] px-6 py-7 ${
                index === 1 ? "bg-tertiary text-secondary" : "bg-secondary text-white"
              }`}
              key={feature.title}
            >
              <p
                className={`text-sm font-semibold ${
                  index === 1 ? "text-secondary/58" : "text-white/56"
                }`}
              >
                0{index + 1}
              </p>
              <h3 className="mt-6 max-w-[12ch] text-[1.5rem] font-bold leading-[1.06] tracking-[-0.04em]">
                {feature.title}
              </h3>
              <p
                className={`mt-4 max-w-[30ch] text-[0.98rem] leading-7 ${
                  index === 1 ? "text-secondary/70" : "text-white/76"
                }`}
              >
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
