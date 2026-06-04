import { z } from "zod";

export const compareSchema = z.object({
  collegeIds: z
    .array(z.string())
    .min(2, "Select at least 2 colleges to compare")
    .max(3, "Maximum 3 colleges can be compared"),
  title: z.string().min(2).max(80).trim().optional(),
});

export type CompareInput = z.infer<typeof compareSchema>;
