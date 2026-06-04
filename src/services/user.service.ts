import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  const [user, savedCount, reviewCount, comparisonCount, predictionCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.savedCollege.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.comparison.count({ where: { userId } }),
      prisma.predictionHistory.count({ where: { userId } }),
    ]);

  if (!user) return null;

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    stats: {
      savedCount,
      reviewCount,
      comparisonCount,
      predictionCount,
    },
  };
}
