import {
  LandingAboutSection,
  LandingFeatureGrid,
  LandingFinalCta,
  LandingHero,
  LandingInstitutionSection,
} from "@/src/features/landing/components";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingFeatureGrid />
      <LandingAboutSection />
      <LandingInstitutionSection />
      <LandingFinalCta />
    </>
  );
}
