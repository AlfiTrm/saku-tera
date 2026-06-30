import type { ComponentProps } from "react";
import { cn } from "@/src/shared/lib/cn";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-black/5", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
