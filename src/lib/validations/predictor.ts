import { z } from "zod";

export const predictorSchema = z.object({
  exam: z.enum(["JEE_MAIN", "KCET", "COMEDK"], {
    error: "Please select a valid exam",
  }),
  rank: z
    .number({ error: "Please enter a valid rank" })
    .int("Rank must be a whole number")
    .min(1, "Rank must be at least 1")
    .max(500000, "Rank must be under 500,000"),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"], {
    error: "Please select a valid category",
  }),
  state: z.string().min(1, "Please select a state"),
});

export type PredictorInput = z.infer<typeof predictorSchema>;
