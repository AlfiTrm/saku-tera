import type { ReactNode } from "react";

type WorkOptionCardProps = {
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  title: string;
};

export function WorkOptionCard({
  description,
  icon,
  isSelected,
  onClick,
  title,
}: WorkOptionCardProps) {
  return (
    <button
      className={`grid min-h-32 gap-3 rounded-[22px] border px-4 py-4 text-left transition-colors ${
        isSelected
          ? "border-primary bg-primary/4 shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-black/10 bg-white hover:border-primary/50"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/4 text-xl">
        {icon}
      </span>
      <div className="grid gap-1">
        <p className="text-base font-semibold text-secondary">{title}</p>
        <p className="text-sm leading-5 text-secondary/55">{description}</p>
      </div>
    </button>
  );
}
