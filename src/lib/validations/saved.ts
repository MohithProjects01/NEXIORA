import { z } from "zod";

export const savedCollegeSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});

export type SavedCollegeInput = z.infer<typeof savedCollegeSchema>;
