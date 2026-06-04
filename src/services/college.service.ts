import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CollegeCard,
  CollegeDetail,
  CollegeFilters,
  PaginatedResponse,
  SortOption,
} from "@/types/college";
import type {
  CollegeMutationInput,
  CollegeUpdateInput,
} from "@/lib/validations/college";

type CollegeCardRecord = Prisma.CollegeGetPayload<{
  include: {
    savedBy: {
      select: {
        userId: true;
      };
    };
  };
}>;

function buildSort(sortBy: SortOption = "rating_desc"): Prisma.CollegeOrderByWithRelationInput {
  switch (sortBy) {
    case "fees_asc":
      return { fees: "asc" };
    case "placement_desc":
      return { placementPercentage: "desc" };
    case "package_desc":
      return { highestPackage: "desc" };
    case "name_asc":
      return { name: "asc" };
    case "rating_desc":
    default:
      return { rating: "desc" };
  }
}

function mapCollegeCard(college: CollegeCardRecord, userId?: string | null): CollegeCard {
  return {
    id: college.id,
    slug: college.slug,
    name: college.name,
    location: college.location,
    state: college.state,
    ownership: college.ownership,
    fees: college.fees,
    rating: college.rating,
    placementPercentage: college.placementPercentage,
    averagePackage: college.averagePackage,
    highestPackage: college.highestPackage,
    image: college.image,
    establishedYear: college.establishedYear,
    featured: college.featured,
    isSaved: userId
      ? college.savedBy.some((entry) => entry.userId === userId)
      : false,
  };
}

function buildWhere(filters: CollegeFilters): Prisma.CollegeWhereInput {
  const where: Prisma.CollegeWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
      { state: { contains: filters.search, mode: "insensitive" } },
      {
        courses: {
          some: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  if (filters.states?.length) {
    where.state = { in: filters.states };
  }

  if (filters.locations?.length) {
    where.location = { in: filters.locations };
  }

  if (filters.ownership?.length) {
    where.ownership = { in: filters.ownership };
  }

  if (filters.minFees !== undefined || filters.maxFees !== undefined) {
    where.fees = {
      gte: filters.minFees,
      lte: filters.maxFees,
    };
  }

  if (filters.minRating !== undefined) {
    where.rating = {
      gte: filters.minRating,
    };
  }

  if (filters.courses?.length) {
    const currentAnd = Array.isArray(where.AND)
      ? where.AND
      : where.AND
        ? [where.AND]
        : [];

    where.AND = [
      ...currentAnd,
      {
        courses: {
          some: {
            OR: filters.courses.map((course) => ({
              name: {
                contains: course,
                mode: "insensitive" as const,
              },
            })),
          },
        },
      },
    ];
  }

  return where;
}

export async function getFeaturedColleges(userId?: string | null, limit = 6) {
  const colleges = await prisma.college.findMany({
    where: { featured: true },
    orderBy: [{ rating: "desc" }, { placementPercentage: "desc" }],
    take: limit,
    include: {
      savedBy: {
        select: { userId: true },
      },
    },
  });

  return colleges.map((college) => mapCollegeCard(college, userId));
}

export async function getCollegeFilterOptions() {
  const [states, locations, courseRows] = await Promise.all([
    prisma.college.findMany({
      distinct: ["state"],
      orderBy: { state: "asc" },
      select: { state: true },
    }),
    prisma.college.findMany({
      distinct: ["location"],
      orderBy: { location: "asc" },
      select: { location: true },
    }),
    prisma.course.findMany({
      distinct: ["name"],
      orderBy: { name: "asc" },
      select: { name: true },
      take: 20,
    }),
  ]);

  return {
    states: states.map((item) => item.state),
    locations: locations.map((item) => item.location),
    courses: courseRows.map((item) => item.name),
  };
}

export async function listColleges(
  filters: CollegeFilters,
  userId?: string | null
): Promise<PaginatedResponse<CollegeCard>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;
  const where = buildWhere(filters);

  const [total, colleges] = await Promise.all([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where,
      orderBy: [buildSort(filters.sortBy), { name: "asc" }],
      skip,
      take: limit,
      include: {
        savedBy: {
          select: { userId: true },
        },
      },
    }),
  ]);

  return {
    data: colleges.map((college) => mapCollegeCard(college, userId)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getCollegeById(id: string, userId?: string | null) {
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      savedBy: {
        select: { userId: true },
      },
      courses: {
        orderBy: { fees: "asc" },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!college) return null;

  const averageRating =
    college.reviews.length > 0
      ? Number(
          (
            college.reviews.reduce((sum, review) => sum + review.rating, 0) /
            college.reviews.length
          ).toFixed(1)
        )
      : 0;

  const detail: CollegeDetail = {
    id: college.id,
    slug: college.slug,
    name: college.name,
    location: college.location,
    state: college.state,
    ownership: college.ownership,
    fees: college.fees,
    rating: college.rating,
    placementPercentage: college.placementPercentage,
    averagePackage: college.averagePackage,
    highestPackage: college.highestPackage,
    image: college.image,
    establishedYear: college.establishedYear,
    featured: college.featured,
    isSaved: userId
      ? college.savedBy.some((entry) => entry.userId === userId)
      : false,
    description: college.description,
    website: college.website,
    topRecruiters: college.topRecruiters,
    courses: college.courses.map((course) => ({
      id: course.id,
      name: course.name,
      duration: course.duration,
      fees: course.fees,
    })),
    reviewStats: {
      averageRating,
      totalReviews: college._count.reviews,
    },
  };

  return detail;
}

export async function getCollegeBySlug(slug: string, userId?: string | null) {
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!college) return null;
  return getCollegeById(college.id, userId);
}

export async function createCollege(input: CollegeMutationInput) {
  return prisma.college.create({
    data: {
      ...input,
    },
  });
}

export async function updateCollege(id: string, input: CollegeUpdateInput) {
  return prisma.college.update({
    where: { id },
    data: {
      ...input,
    },
  });
}

export async function deleteCollege(id: string) {
  return prisma.college.delete({
    where: { id },
  });
}
