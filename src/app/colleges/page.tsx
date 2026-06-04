import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { parseNumberParam } from "@/lib/query-params";
import { CollegeGrid } from "@/components/colleges/college-grid";
import { FilterPanel } from "@/components/colleges/filter-panel";
import { Pagination } from "@/components/shared/pagination";
import { listColleges, getCollegeFilterOptions } from "@/services/college.service";

export const metadata: Metadata = {
  title: "Colleges",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function readFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const session = await auth();
  const filters = {
    search: readFirst(params.search),
    states: readFirst(params.states) ? [readFirst(params.states)!] : undefined,
    locations: readFirst(params.locations) ? [readFirst(params.locations)!] : undefined,
    ownership: readFirst(params.ownership)
      ? [readFirst(params.ownership)! as "GOVERNMENT" | "PRIVATE"]
      : undefined,
    minFees: parseNumberParam(readFirst(params.minFees) ?? null),
    maxFees: parseNumberParam(readFirst(params.maxFees) ?? null),
    minRating: parseNumberParam(readFirst(params.minRating) ?? null),
    courses: readFirst(params.courses) ? [readFirst(params.courses)!] : undefined,
    sortBy: (readFirst(params.sortBy) ?? "rating_desc") as
      | "rating_desc"
      | "fees_asc"
      | "placement_desc"
      | "package_desc"
      | "name_asc",
    page: parseNumberParam(readFirst(params.page) ?? null, 1),
    limit: 20,
  };

  const [result, filterOptions] = await Promise.all([
    listColleges(filters, session?.user?.id),
    getCollegeFilterOptions(),
  ]);

  const buildHref = (page: number) => {
    const nextParams = new URLSearchParams();

    Object.entries({
      search: filters.search,
      states: filters.states?.[0],
      locations: filters.locations?.[0],
      ownership: filters.ownership?.[0],
      minFees: filters.minFees?.toString(),
      maxFees: filters.maxFees?.toString(),
      minRating: filters.minRating?.toString(),
      courses: filters.courses?.[0],
      sortBy: filters.sortBy,
      page: page.toString(),
    }).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
    });

    return `/colleges?${nextParams.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">College Directory</h1>
        <p className="mt-3 max-w-2xl text-surface-400">
          Search and filter colleges across fees, ratings, location, ownership, and courses.
        </p>
      </div>

      <FilterPanel filters={{ ...filterOptions, selected: filters }} />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-surface-400">
          Showing page {result.pagination.page} of {result.pagination.totalPages} ·{" "}
          {result.pagination.total} colleges found
        </p>
      </div>

      <div className="mt-8">
        <CollegeGrid colleges={result.data} />
      </div>

      <div className="mt-10">
        <Pagination
          page={result.pagination.page}
          totalPages={result.pagination.totalPages}
          buildHref={buildHref}
        />
      </div>
    </div>
  );
}
