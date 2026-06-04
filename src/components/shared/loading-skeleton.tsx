export function LoadingSkeleton({
  className = "h-24 w-full rounded-2xl",
}: {
  className?: string;
}) {
  return <div className={`skeleton ${className}`} />;
}
