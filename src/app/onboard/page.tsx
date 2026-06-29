export default function OnboardPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="grid w-full max-w-[42rem] gap-4 rounded-[2rem] border border-[rgba(255,255,250,0.08)] bg-[rgba(19,25,46,0.78)] p-8 text-white shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-[12px]">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,250,0.78)]">
          Onboarding
        </p>
        <h1 className="max-w-[12ch] text-[clamp(2.5rem,8vw,5.75rem)] font-bold leading-[0.96] tracking-[-0.05em]">
          Ini onboard nanti.
        </h1>
        <p className="max-w-[42rem] text-base leading-7 text-[rgba(255,255,250,0.78)]">
          Route ini masih placeholder. Nanti kita isi flow onboarding sesudah
          arah produk dan UX-nya sudah final.
        </p>
      </section>
    </main>
  );
}
