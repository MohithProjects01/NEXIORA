import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getUserProfile } from "@/services/user.service";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Login required"
          description="Sign in to manage your account and activity."
          actionHref="/login"
          actionLabel="Login"
        />
      </div>
    );
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState title="Profile not found" description="The account could not be loaded." />
      </div>
    );
  }

  const statCards = [
    { label: "Saved colleges", value: profile.stats.savedCount },
    { label: "Reviews posted", value: profile.stats.reviewCount },
    { label: "Comparisons saved", value: profile.stats.comparisonCount },
    { label: "Predictions run", value: profile.stats.predictionCount },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">{profile.name}</h1>
        <p className="mt-3 text-surface-400">{profile.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-surface-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-semibold text-white">Account summary</h2>
        <p className="mt-3 text-sm leading-7 text-surface-300">
          Your profile is connected to saved colleges, side-by-side comparison snapshots,
          submitted reviews, and prediction history. This page is designed as a
          dashboard-ready base for future account settings and personalization flows.
        </p>
      </Card>
    </div>
  );
}
