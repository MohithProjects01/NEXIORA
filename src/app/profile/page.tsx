import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, GitCompareArrows, GraduationCap, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileSettingsForm } from "@/features/profile/profile-settings-form";
import { getUserProfile } from "@/services/user.service";

export const metadata: Metadata = {
  title: "Profile",
};

const quickLinks = [
  {
    href: "/saved",
    label: "Saved colleges",
    description: "Review your shortlist",
    icon: Bookmark,
  },
  {
    href: "/compare",
    label: "Comparisons",
    description: "Open saved side-by-side views",
    icon: GitCompareArrows,
  },
  {
    href: "/predictor",
    label: "Predictor",
    description: "Run admission estimates",
    icon: Sparkles,
  },
  {
    href: "/colleges",
    label: "Colleges",
    description: "Discover more institutions",
    icon: GraduationCap,
  },
];

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
        <p className="mt-1 text-sm text-surface-500">
          Member since {new Date(profile.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-surface-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="card-hover h-full">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-200">
                  <link.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{link.label}</p>
                  <p className="mt-1 text-sm text-surface-400">{link.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <ProfileSettingsForm defaultName={profile.name} />

        <Card>
          <h2 className="text-xl font-semibold text-white">Activity overview</h2>
          <p className="mt-3 text-sm leading-7 text-surface-300">
            Your account tracks saved colleges, comparison snapshots, submitted reviews,
            and prediction history across JEE Main, KCET, and COMEDK.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/saved">
              <Button variant="secondary" size="sm">
                View saved colleges
              </Button>
            </Link>
            <Link href="/predictor">
              <Button variant="outline" size="sm">
                Open predictor
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
