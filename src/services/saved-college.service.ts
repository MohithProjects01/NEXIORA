import { prisma } from "@/lib/prisma";
import type { CollegeCard } from "@/types/college";

function mapSavedCollege(record: {
  college: {
    id: string;
    slug: string;
    name: string;
    location: string;
    state: string;
    ownership: "GOVERNMENT" | "PRIVATE";
    fees: number;
    rating: number;
    placementPercentage: number;
    averagePackage: number;
    highestPackage: number;
    image: string | null;
    establishedYear: number;
    featured: boolean;
  };
}): CollegeCard {
  return {
    ...record.college,
    isSaved: true,
  };
}

export async function listSavedColleges(userId: string) {
  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      college: true,
    },
  });

  return saved.map(mapSavedCollege);
}

export async function saveCollege(userId: string, collegeId: string) {
  return prisma.savedCollege.upsert({
    where: {
      userId_collegeId: {
        userId,
        collegeId,
      },
    },
    update: {},
    create: {
      userId,
      collegeId,
    },
  });
}

export async function removeSavedCollege(userId: string, collegeId: string) {
  return prisma.savedCollege.deleteMany({
    where: {
      userId,
      collegeId,
    },
  });
}
