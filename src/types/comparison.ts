export interface ComparisonData {
  id: string;
  title: string;
  collegeIds: string[];
  colleges: ComparisonCollege[];
  createdAt: string;
}

export interface ComparisonCollege {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  ownership: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  establishedYear: number;
  courses: string[];
}
