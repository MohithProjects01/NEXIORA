import type { Ownership } from "@prisma/client";

export interface CollegeCard {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  ownership: Ownership;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  image: string | null;
  establishedYear: number;
  featured?: boolean;
  isSaved?: boolean;
}

export interface CollegeDetail extends CollegeCard {
  description: string;
  website: string | null;
  topRecruiters: string[];
  courses: CourseInfo[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface CourseInfo {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

export interface CollegeFilters {
  search?: string;
  states?: string[];
  locations?: string[];
  ownership?: Ownership[];
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  courses?: string[];
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption =
  | "rating_desc"
  | "fees_asc"
  | "placement_desc"
  | "package_desc"
  | "name_asc";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
