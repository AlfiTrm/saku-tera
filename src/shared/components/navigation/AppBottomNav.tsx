"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

type AppBottomNavItem = {
  href: string;
  icon: string;
  isActive?: boolean;
  label: string;
};

type AppBottomNavProps = {
  items: AppBottomNavItem[];
};

export function AppBottomNav({ items }: AppBottomNavProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto box-border w-full max-w-[29rem] border-t border-secondary/15 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4 divide-x divide-secondary/10">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              aria-current={item.isActive ? "page" : undefined}
              className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                item.isActive ? "bg-primary/[0.065]" : "bg-transparent hover:bg-secondary/[0.035]"
              }`}
              href={item.href}
            >
              <span
                className={`absolute inset-x-0 top-0 h-0.5 transition-colors ${
                  item.isActive ? "bg-primary" : "bg-transparent"
                }`}
              />
              <span
                className={`inline-flex h-8 w-8 items-center justify-center transition-colors ${
                  item.isActive ? "text-primary" : "text-secondary/62"
                }`}
              >
                <Icon className="h-[23px] w-[23px]" icon={item.icon} />
              </span>
              <span
                className={`leading-none ${
                  item.isActive ? "text-primary" : "text-secondary/62"
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
