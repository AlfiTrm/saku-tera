"use client";

import { Icon } from "@iconify/react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import type { PassportAccessEntry } from "@/src/features/dashboard/types/passportAccess";

type PassportAccessCardProps = {
  entry: PassportAccessEntry;
};

export function PassportAccessCard({ entry }: PassportAccessCardProps) {
  const isActive = entry.badgeTone === "active";

  return (
    <article className="rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/[0.04] text-secondary/35">
            <Icon className="h-4 w-4" icon={entry.icon} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold text-secondary">
              {entry.organization}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-secondary/35">
              {entry.issuedText}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            isActive
              ? "text-emerald-500"
              : "text-tertiary"
          }`}
        >
          {entry.badgeLabel}
        </span>
      </div>

      {entry.metrics.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.metrics.map((metric) => (
            <span
              className="rounded-lg bg-primary/[0.06] px-2.5 py-1 text-[10px] font-semibold text-primary"
              key={metric}
            >
              {metric}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-2 border-t border-black/6 pt-2.5 text-[11px] font-medium text-secondary/35">
        <Icon className="h-3.5 w-3.5 shrink-0" icon="solar:clock-circle-linear" />
        <span className="truncate">{entry.expiresText}</span>
      </div>

      {entry.showActions ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PressButton
            className="min-h-12 w-full justify-center border border-[#ffb5b5] bg-[#fff4f4] text-[#f05c5c] shadow-none hover:bg-[#fff1f1]"
            variant="outline"
          >
            Cabut Akses
          </PressButton>
          <PressButton className="min-h-12 w-full justify-center" variant="outline">
            Detail
          </PressButton>
        </div>
      ) : null}
    </article>
  );
}
