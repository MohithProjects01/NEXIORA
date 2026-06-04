import { Category, Exam, Ownership, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PredictorInput, PredictionHistoryItem, PredictionResult } from "@/types/predictor";

const examScale: Record<Exam, number> = {
  JEE_MAIN: 220000,
  KCET: 120000,
  COMEDK: 45000,
};

const categoryBoost: Record<Category, number> = {
  GENERAL: 0,
  OBC: 4,
  SC: 9,
  ST: 11,
  EWS: 3,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getTierScore(rating: number, placementPercentage: number, highestPackage: number) {
  return rating * 18 + placementPercentage * 0.38 + highestPackage * 0.9;
}

function computeMatch(
  input: PredictorInput,
  college: {
    id: string;
    slug: string;
    name: string;
    location: string;
    state: string;
    fees: number;
    rating: number;
    placementPercentage: number;
    averagePackage: number;
    ownership: Ownership;
  }
): PredictionResult {
  const maxRank = examScale[input.exam];
  const normalizedRank = 1 - clamp(input.rank / maxRank, 0, 1);
  const strengthScore = getTierScore(
    college.rating,
    college.placementPercentage,
    college.averagePackage * 1.4
  );
  const stateBonus = college.state === input.state ? 8 : 0;
  const categoryBonus = categoryBoost[input.category];
  const ownershipAdjustment =
    input.exam === Exam.COMEDK && college.ownership === Ownership.PRIVATE
      ? 6
      : college.ownership === Ownership.GOVERNMENT
        ? 3
        : 0;

  const probabilityScore = clamp(
    Math.round(normalizedRank * 62 + stateBonus + categoryBonus + ownershipAdjustment),
    18,
    97
  );

  const matchPercentage = clamp(
    Math.round(probabilityScore * 0.72 + strengthScore * 0.32),
    22,
    98
  );

  const confidence =
    probabilityScore >= 82 ? "High" : probabilityScore >= 60 ? "Medium" : "Low";

  return {
    college: {
      id: college.id,
      slug: college.slug,
      name: college.name,
      location: college.location,
      state: college.state,
      fees: college.fees,
      rating: college.rating,
      placementPercentage: college.placementPercentage,
      averagePackage: college.averagePackage,
      ownership: college.ownership,
    },
    matchPercentage,
    probabilityScore,
    confidence,
  };
}

export async function runPrediction(input: PredictorInput, userId?: string | null) {
  const candidateColleges = await prisma.college.findMany({
    where:
      input.exam === Exam.COMEDK
        ? { ownership: Ownership.PRIVATE }
        : undefined,
    orderBy: [{ rating: "desc" }, { placementPercentage: "desc" }],
    take: 40,
    select: {
      id: true,
      slug: true,
      name: true,
      location: true,
      state: true,
      fees: true,
      rating: true,
      placementPercentage: true,
      averagePackage: true,
      ownership: true,
    },
  });

  const results = candidateColleges
    .map((college) => computeMatch(input, college))
    .sort((left, right) => {
      if (right.matchPercentage !== left.matchPercentage) {
        return right.matchPercentage - left.matchPercentage;
      }
      return right.probabilityScore - left.probabilityScore;
    })
    .slice(0, 8);

  if (userId) {
    await prisma.predictionHistory.create({
      data: {
        userId,
        exam: input.exam,
        rank: input.rank,
        category: input.category,
        state: input.state,
        results: results as unknown as Prisma.InputJsonValue,
      },
    });
  }

  return results;
}

export async function getPredictionHistory(userId: string): Promise<PredictionHistoryItem[]> {
  const rows = await prisma.predictionHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    exam: row.exam,
    rank: row.rank,
    category: row.category,
    state: row.state,
    results: row.results as unknown as PredictionResult[],
    createdAt: row.createdAt.toISOString(),
  }));
}
