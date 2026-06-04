import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-xl border border-white/10 bg-surface-900 px-4 text-sm text-surface-50 placeholder:text-surface-400",
        className
      )}
      {...props}
    />
  );
}
