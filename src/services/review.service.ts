import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import type { ReviewData, ReviewStats } from "@/types/review";
import type { ReviewInput, UpdateReviewInput } from "@/lib/validations/review";

function mapReview(record: Awaited<ReturnType<typeof getReviewRecord>>) {
  return {
    id: record.id,
    rating: record.rating,
    comment: record.comment,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    user: {
      id: record.user.id,
      name: record.user.name,
      image: record.user.image,
    },
  } satisfies ReviewData;
}

async function getReviewRecord(reviewId: string) {
  return prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getCollegeReviews(collegeId: string) {
  const [reviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    getReviewStats(collegeId),
  ]);

  return {
    reviews: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      user: review.user,
    })),
    stats,
  };
}

export async function getReviewStats(collegeId: string): Promise<ReviewStats> {
  const reviews = await prisma.review.findMany({
    where: { collegeId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
          ).toFixed(1)
        );

  const distribution = reviews.reduce<Record<number, number>>((accumulator, review) => {
    accumulator[review.rating] = (accumulator[review.rating] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    averageRating,
    totalReviews,
    distribution,
  };
}

export async function createReview(userId: string, input: ReviewInput) {
  const review = await prisma.review.create({
    data: {
      userId,
      collegeId: input.collegeId,
      rating: input.rating,
      comment: sanitizeText(input.comment),
    },
  });

  return mapReview(await getReviewRecord(review.id));
}

export async function updateReview(reviewId: string, userId: string, input: UpdateReviewInput) {
  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true },
  });

  if (!existing) return null;
  if (existing.userId !== userId) return "FORBIDDEN" as const;

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.comment !== undefined
        ? { comment: sanitizeText(input.comment) }
        : {}),
    },
  });

  return mapReview(await getReviewRecord(review.id));
}

export async function deleteReview(reviewId: string, userId: string) {
  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true },
  });

  if (!existing) return null;
  if (existing.userId !== userId) return "FORBIDDEN" as const;

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { success: true };
}
