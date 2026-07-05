import Link from "next/link";
import type { ReactNode } from "react";
import { OnboardingProgress } from "./OnboardingProgress";

type OnboardingShellProps = {
  backHref?: string;
  children: ReactNode;
  currentStep: number;
  description: string;
  footer?: ReactNode;
  showProgress?: boolean;
  title: string;
  totalSteps?: number;
};

export function OnboardingShell({
  backHref,
  children,
  currentStep,
  description,
  footer,
  showProgress = true,
  title,
  totalSteps = 5,
}: OnboardingShellProps) {
  return (
    <main className="mx-auto box-border flex min-h-screen w-full max-w-[29rem] flex-col overflow-x-hidden px-5 pb-8 pt-4 text-secondary sm:px-6">
      {showProgress ? (
        <div className="mb-4 flex min-h-8 items-center justify-between">
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
          <span />
        </div>
      ) : null}

      {backHref ? (
        <Link
          className="mb-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-1 text-sm font-semibold text-secondary/80 transition-opacity hover:opacity-70"
          href={backHref}
        >
          <span aria-hidden="true">‹</span>
          Kembali
        </Link>
      ) : null}

      <section className="grid gap-3">
        <div>
          <h1 className="max-w-[12ch] text-[1.95rem] font-bold leading-[1.02] tracking-[-0.04em] text-secondary sm:text-[2.1rem]">
            {title}
          </h1>
          <p className="mt-2 max-w-[30ch] text-[0.95rem] leading-6 text-secondary/55">
            {description}
          </p>
        </div>

        {children}
      </section>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </main>
  );
}
