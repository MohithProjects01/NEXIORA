import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { CompareWorkspace } from "@/components/compare/compare-workspace";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { EmptyState } from "@/components/shared/empty-state";
import { listComparisons } from "@/services/comparison.service";

export const metadata: Metadata = {
  title: "Compare Colleges",
};

export default async function ComparePage() {
  const session = await auth();
  const savedComparisons = session?.user?.id
    ? await listComparisons(session.user.id)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">College Comparison</h1>
        <p className="mt-3 max-w-2xl text-surface-400">
          Build a side-by-side decision matrix for up to three colleges and save it to your account.
        </p>
      </div>

      <CompareWorkspace />

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold text-white">Saved comparisons</h2>
        {savedComparisons.length ? (
          savedComparisons.map((comparison) => (
            <ComparisonTable
              key={comparison.id}
              comparison={comparison}
              showDelete
            />
          ))
        ) : (
          <EmptyState
            title="No saved comparisons yet"
            description="Save a live comparison after selecting colleges from the directory."
          />
        )}
      </section>
    </div>
  );
}
