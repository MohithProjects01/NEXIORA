import { CollegeCard } from "@/components/colleges/college-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { CollegeCard as CollegeCardType } from "@/types/college";

export function CollegeGrid({ colleges }: { colleges: CollegeCardType[] }) {
  if (!colleges.length) {
    return (
      <EmptyState
        title="No colleges found"
        description="Try changing your filters or broadening the search query."
        actionHref="/colleges"
        actionLabel="Reset search"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}
