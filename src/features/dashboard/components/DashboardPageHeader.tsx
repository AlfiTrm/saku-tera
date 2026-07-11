import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  action?: ReactNode;
  subtitle: ReactNode;
  title: ReactNode;
};

export function DashboardPageHeader({
  action,
  subtitle,
  title,
}: DashboardPageHeaderProps) {
  return (
    <header className="flex min-h-[76px] items-start justify-between gap-4 px-2 pb-3 pt-1.5">
      <div className="min-w-0">
        <h1 className="truncate text-[1.7rem] font-bold leading-none tracking-[-0.05em] text-secondary">
          {title}
        </h1>
        <div className="mt-1.5 flex min-h-5 items-center text-[12px] font-medium leading-5 text-secondary/42">
          {subtitle}
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
