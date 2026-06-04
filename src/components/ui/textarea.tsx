import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full rounded-xl border border-white/10 bg-surface-900 px-4 py-3 text-sm text-surface-50 placeholder:text-surface-400",
        className
      )}
      {...props}
    />
  );
}
