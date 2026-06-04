import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => Math.max(1, page - 2) + index
  ).filter((item) => item <= totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link href={buildHref(Math.max(1, page - 1))}>
        <Button variant="outline" size="sm" disabled={page === 1}>
          Previous
        </Button>
      </Link>
      {pages.map((item) => (
        <Link key={item} href={buildHref(item)}>
          <Button variant={item === page ? "secondary" : "ghost"} size="sm">
            {item}
          </Button>
        </Link>
      ))}
      <Link href={buildHref(Math.min(totalPages, page + 1))}>
        <Button variant="outline" size="sm" disabled={page === totalPages}>
          Next
        </Button>
      </Link>
    </div>
  );
}
