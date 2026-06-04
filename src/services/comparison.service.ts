import { prisma } from "@/lib/prisma";
import type { CompareInput } from "@/lib/validations/compare";
import type { ComparisonData } from "@/types/comparison";

type ComparisonRecord = Awaited<ReturnType<typeof prisma.comparison.findUniqueOrThrow>>;

async function mapComparison(record: ComparisonRecord) {
  const colleges = await prisma.college.findMany({
    where: { id: { in: record.collegeIds } },
    include: {
      courses: {
        orderBy: { name: "asc" },
      },
    },
  });

  const orderedColleges = record.collegeIds
    .map((collegeId) => colleges.find((college) => college.id === collegeId))
    .filter(Boolean);

  return {
    id: record.id,
    title: record.title,
    collegeIds: record.collegeIds,
    createdAt: record.createdAt.toISOString(),
    colleges: orderedColleges.map((college) => ({
      id: college!.id,
      slug: college!.slug,
      name: college!.name,
      location: college!.location,
      state: college!.state,
      ownership: college!.ownership,
      fees: college!.fees,
      rating: college!.rating,
      placementPercentage: college!.placementPercentage,
      averagePackage: college!.averagePackage,
      highestPackage: college!.highestPackage,
      establishedYear: college!.establishedYear,
      courses: college!.courses.map((course) => course.name),
    })),
  } satisfies ComparisonData;
}

export async function createComparison(userId: string, input: CompareInput) {
  const comparison = await prisma.comparison.create({
    data: {
      userId,
      title:
        input.title?.trim() ||
        `Comparison - ${new Date().toLocaleDateString("en-IN")}`,
      collegeIds: input.collegeIds,
    },
  });

  return mapComparison(
    await prisma.comparison.findUniqueOrThrow({
      where: { id: comparison.id },
    })
  );
}

export async function listComparisons(userId: string) {
  const comparisons = await prisma.comparison.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(
    comparisons.map(async (comparison) =>
      mapComparison(
        await prisma.comparison.findUniqueOrThrow({
          where: { id: comparison.id },
        })
      )
    )
  );
}

export async function buildComparisonPreview(collegeIds: string[]) {
  const comparison = {
    id: "preview",
    title: "Live comparison",
    collegeIds,
    createdAt: new Date(),
  };

  return mapComparison(comparison as ComparisonRecord);
}
