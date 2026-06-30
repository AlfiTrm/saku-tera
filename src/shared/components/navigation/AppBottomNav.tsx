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
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[29rem] rounded-t-[1.8rem] border-t border-black/6 bg-[#fffdf8]/96 px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_rgba(23,23,56,0.08)] backdrop-blur-sm">
      <ul className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              aria-current={item.isActive ? "page" : undefined}
              className="relative flex min-h-[62px] flex-col items-center justify-center gap-0.5 rounded-2xl pt-1 text-[10px] font-semibold transition-colors"
              href={item.href}
            >
              <span
                className={`absolute top-0 h-1 rounded-full transition-all ${
                  item.isActive ? "w-7 bg-primary" : "w-3 bg-transparent"
                }`}
              />
              <span
                className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-full transition-colors ${
                  item.isActive
                    ? "bg-primary/10 text-primary"
                    : "text-secondary/26"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" icon={item.icon} />
              </span>
              <span
                className={`leading-none ${
                  item.isActive ? "text-primary" : "text-secondary/34"
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
