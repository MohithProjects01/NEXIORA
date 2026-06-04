import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(rating);

        return (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              filled ? "star-filled fill-current" : "text-surface-600"
            )}
          />
        );
      })}
      <span className="ml-2 text-sm text-surface-300">{rating.toFixed(1)}</span>
    </div>
  );
}
