import { z } from "zod";

export const collegeFilterSchema = z.object({
  search: z.string().optional(),
  states: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  ownership: z.array(z.enum(["GOVERNMENT", "PRIVATE"])).optional(),
  minFees: z.number().min(0).optional(),
  maxFees: z.number().min(0).optional(),
  minRating: z.number().min(0).max(5).optional(),
  courses: z.array(z.string()).optional(),
  sortBy: z
    .enum(["rating_desc", "fees_asc", "placement_desc", "package_desc", "name_asc"])
    .optional()
    .default("rating_desc"),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const collegeMutationSchema = z.object({
  slug: z.string().min(2).max(150).trim(),
  name: z.string().min(2).max(160).trim(),
  description: z.string().min(30).max(5000).trim(),
  location: z.string().min(2).max(80).trim(),
  state: z.string().min(2).max(80).trim(),
  ownership: z.enum(["GOVERNMENT", "PRIVATE"]),
  fees: z.number().min(0),
  rating: z.number().min(0).max(5),
  placementPercentage: z.number().min(0).max(100),
  averagePackage: z.number().min(0),
  highestPackage: z.number().min(0),
  website: z.string().url().optional().or(z.literal("")).transform((value) => value || undefined),
  topRecruiters: z.array(z.string().min(2).max(80)).min(1).max(10),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()),
  featured: z.boolean().optional().default(false),
  image: z.string().url().optional().or(z.literal("")).transform((value) => value || undefined),
});

export const collegeUpdateSchema = collegeMutationSchema.partial();

export type CollegeFilterInput = z.infer<typeof collegeFilterSchema>;
export type CollegeMutationInput = z.infer<typeof collegeMutationSchema>;
export type CollegeUpdateInput = z.infer<typeof collegeUpdateSchema>;
