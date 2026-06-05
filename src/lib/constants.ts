import type { Category, Exam, Ownership } from "@prisma/client";
import type { SortOption } from "@/types/college";

export const APP_NAME = "CollegeCompass AI";

export const EXAM_OPTIONS: Array<{ label: string; value: Exam }> = [
  { label: "JEE Main", value: "JEE_MAIN" },
  { label: "KCET", value: "KCET" },
  { label: "COMEDK", value: "COMEDK" },
];

export const CATEGORY_OPTIONS: Array<{ label: string; value: Category }> = [
  { label: "General", value: "GENERAL" },
  { label: "OBC", value: "OBC" },
  { label: "SC", value: "SC" },
  { label: "ST", value: "ST" },
  { label: "EWS", value: "EWS" },
];

export const OWNERSHIP_OPTIONS: Array<{ label: string; value: Ownership }> = [
  { label: "Government", value: "GOVERNMENT" },
  { label: "Private", value: "PRIVATE" },
];

export const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Highest Rating", value: "rating_desc" },
  { label: "Lowest Fees", value: "fees_asc" },
  { label: "Highest Placement Percentage", value: "placement_desc" },
  { label: "Highest Package", value: "package_desc" },
  { label: "Alphabetical", value: "name_asc" },
];

export const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
  { href: "/saved", label: "Saved" },
];

export function getPublicAdminEmails() {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "demo@collegecompass.ai";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const FEATURED_STATS = [
  { label: "Colleges indexed", value: "200+" },
  { label: "Courses tracked", value: "500+" },
  { label: "Student reviews", value: "1000+" },
  { label: "Compare slots", value: "3-way" },
];

export const COLLEGE_SEARCH_PLACEHOLDER =
  "Search by college, city, state, or course";
