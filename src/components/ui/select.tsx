import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring h-11 w-full rounded-xl border border-white/10 bg-surface-900 px-4 text-sm text-surface-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
