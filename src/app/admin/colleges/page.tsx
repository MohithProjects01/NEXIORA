import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { EmptyState } from "@/components/shared/empty-state";
import { CollegeAdminPanel } from "@/features/admin/college-admin-panel";
import { listColleges } from "@/services/college.service";

export const metadata: Metadata = {
  title: "Admin · Colleges",
};

export default async function AdminCollegesPage() {
  const session = await auth();

  if (!session?.user?.id || !isAdminEmail(session.user.email)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Admin access required"
          description="Sign in with an admin account to manage colleges."
          actionHref="/login?callbackUrl=/admin/colleges"
          actionLabel="Login"
        />
      </div>
    );
  }

  const { data: colleges } = await listColleges(
    { page: 1, limit: 100, sortBy: "name_asc" },
    session.user.id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">College administration</h1>
        <p className="mt-3 max-w-2xl text-surface-400">
          Manage the college directory used across discovery, comparison, and prediction flows.
        </p>
      </div>

      <CollegeAdminPanel colleges={colleges} />
    </div>
  );
}
