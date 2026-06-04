import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { CollegeGrid } from "@/components/colleges/college-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { listSavedColleges } from "@/services/saved-college.service";

export const metadata: Metadata = {
  title: "Saved Colleges",
};

export default async function SavedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Login required"
          description="Sign in to view and manage your saved college shortlist."
          actionHref="/login"
          actionLabel="Login"
        />
      </div>
    );
  }

  const colleges = await listSavedColleges(session.user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">Saved Colleges</h1>
        <p className="mt-3 text-surface-400">
          Keep a shortlist of colleges you want to revisit while comparing your options.
        </p>
      </div>

      <CollegeGrid colleges={colleges} />
    </div>
  );
}
