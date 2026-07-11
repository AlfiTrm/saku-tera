"use client";

import { Icon } from "@iconify/react";
import type { PassportHistoryEntry } from "@/src/features/dashboard/types/passportHistory";

type PassportHistoryTimelineItemProps = {
  entry: PassportHistoryEntry;
  isLast: boolean;
};

export function PassportHistoryTimelineItem({
  entry,
  isLast,
}: PassportHistoryTimelineItemProps) {
  const isValid = entry.status === "valid";
  const metrics = Array.isArray(entry.metrics) ? entry.metrics : [];

  return (
    <article className="grid grid-cols-[2.25rem_1fr] gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
            isValid ? "bg-emerald-500 text-white" : "bg-secondary/10 text-secondary/36"
          }`}
        >
          <Icon
            className="h-4 w-4"
            icon={
              isValid
                ? "solar:shield-check-bold"
                : "solar:shield-cross-bold"
            }
          />
        </span>
        {!isLast ? (
          <span className="mt-2 h-full w-px bg-black/8" />
        ) : (
          <span className="mt-2 h-4 w-px bg-transparent" />
        )}
      </div>

      <div className="rounded-[20px] border border-black/6 bg-white px-4 py-3 shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold text-secondary">
              {entry.organization}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-secondary/35">
              {entry.timestamp}
            </p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isValid ? "text-emerald-500" : "text-secondary/28"
            }`}
          >
            {entry.badgeLabel}
          </span>
        </div>

        {metrics.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <span
                className="rounded-lg bg-primary/[0.06] px-2.5 py-1 text-[10px] font-semibold text-primary"
                key={metric}
              >
                {metric}
              </span>
            ))}
          </div>
        ) : null}

        <p
          className={`mt-4 text-sm font-medium leading-6 ${
            isValid ? "text-secondary/42" : "text-secondary/30"
          }`}
        >
          {entry.accessSummary}
        </p>
      </div>
    </article>
  );
}
