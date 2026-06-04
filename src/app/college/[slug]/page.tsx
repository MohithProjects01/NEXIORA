import type { Metadata } from "next";
import Link from "next/link";
import { Globe, GraduationCap, Landmark, MapPin, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SaveCollegeButton } from "@/components/colleges/save-college-button";
import { CompareToggle } from "@/components/colleges/compare-toggle";
import { DeleteReviewButton } from "@/components/reviews/delete-review-button";
import { RatingStars } from "@/components/reviews/rating-stars";
import { ReviewForm } from "@/components/reviews/review-form";
import { getCollegeBySlug } from "@/services/college.service";
import { getCollegeReviews } from "@/services/review.service";
import { formatCurrency, formatPercentage, timeAgo } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    return { title: "College Not Found" };
  }

  return {
    title: college.name,
    description: college.description,
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const session = await auth();
  const college = await getCollegeBySlug(slug, session?.user?.id);

  if (!college) {
    notFound();
  }

  const { reviews, stats } = await getCollegeReviews(college.id);
  const currentUserReview = reviews.find((review) => review.user.id === session?.user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{college.ownership}</Badge>
            <Badge>{college.establishedYear}</Badge>
            <Badge>{college.location}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-white">{college.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-400">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {college.location}, {college.state}
            </span>
            {college.website ? (
              <Link
                href={college.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Globe className="h-4 w-4" />
                Website
              </Link>
            ) : null}
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-surface-300">
            {college.description}
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <RatingStars rating={college.reviewStats.averageRating || college.rating} />
            <p className="text-sm text-surface-400">
              {college.reviewStats.totalReviews} student reviews
            </p>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-surface-400">Annual fees</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(college.fees)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-surface-400">Placement rate</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatPercentage(college.placementPercentage)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveCollegeButton collegeId={college.id} initialSaved={college.isSaved} />
              <CompareToggle collegeId={college.id} />
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Card>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-brand-300" />
              <h2 className="text-2xl font-semibold text-white">Courses</h2>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-white/10 text-surface-400">
                  <tr>
                    <th className="py-3">Course</th>
                    <th className="py-3">Duration</th>
                    <th className="py-3">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course) => (
                    <tr key={course.id} className="border-b border-white/5 text-surface-100">
                      <td className="py-3 pr-4">{course.name}</td>
                      <td className="py-3 pr-4">{course.duration}</td>
                      <td className="py-3">{formatCurrency(course.fees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-300" />
              <h2 className="text-2xl font-semibold text-white">Placements</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-surface-400">Average package</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {college.averagePackage.toFixed(1)} LPA
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-surface-400">Highest package</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {college.highestPackage.toFixed(1)} LPA
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-surface-400">Placement percentage</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatPercentage(college.placementPercentage)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-surface-200">Top recruiters</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {college.topRecruiters.map((recruiter) => (
                  <Badge key={recruiter}>{recruiter}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Landmark className="h-5 w-5 text-cyan-300" />
              <h2 className="text-2xl font-semibold text-white">Reviews</h2>
            </div>
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{review.user.name}</p>
                      <p className="text-xs text-surface-400">{timeAgo(review.createdAt)}</p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-surface-300">{review.comment}</p>
                  {review.user.id === session?.user?.id ? (
                    <div className="mt-4 flex gap-3">
                      <DeleteReviewButton reviewId={review.id} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-white">Review snapshot</h2>
            <p className="mt-2 text-sm text-surface-400">
              {stats.totalReviews} reviews with an average rating of {stats.averageRating.toFixed(1)}
            </p>
          </Card>
          <ReviewForm
            collegeId={college.id}
            reviewId={currentUserReview?.id}
            defaultValues={
              currentUserReview
                ? {
                    rating: currentUserReview.rating,
                    comment: currentUserReview.comment,
                  }
                : undefined
            }
          />
        </div>
      </section>
    </div>
  );
}
