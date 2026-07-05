"use client";

import { Icon } from "@iconify/react";
import type { ReactNode } from "react";

type DashboardEmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon: string;
  title: string;
};

export function DashboardEmptyState({
  action,
  description,
  icon,
  title,
}: DashboardEmptyStateProps) {
  return (
    <div className="grid justify-items-center gap-3 rounded-[22px] border border-dashed border-black/8 bg-white px-5 py-8 text-center shadow-[0_10px_22px_rgba(23,23,56,0.04)]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
        <Icon className="h-6 w-6" icon={icon} />
      </span>
      <div className="grid gap-1">
        <h3 className="text-base font-semibold text-secondary">{title}</h3>
        <p className="max-w-[28ch] text-sm leading-6 text-secondary/52">{description}</p>
      </div>
      {action}
    </div>
  );
}
