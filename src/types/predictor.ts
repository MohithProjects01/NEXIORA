import type { Exam, Category } from "@prisma/client";

export interface PredictorInput {
  exam: Exam;
  rank: number;
  category: Category;
  state: string;
}

export interface PredictionResult {
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
    ownership: string;
  };
  matchPercentage: number;
  probabilityScore: number;
  confidence: "High" | "Medium" | "Low";
}

export interface PredictionHistoryItem {
  id: string;
  exam: Exam;
  rank: number;
  category: Category;
  state: string;
  results: PredictionResult[];
  createdAt: string;
}
