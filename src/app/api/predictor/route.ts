import { auth } from "@/lib/auth";
import { ok, serverError, zodErrorResponse } from "@/lib/http";
import { predictorSchema } from "@/lib/validations/predictor";
import { runPrediction } from "@/services/predictor.service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const parsed = predictorSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const results = await runPrediction(parsed.data, session?.user?.id);

    return ok({
      results,
      meta: {
        savedToHistory: Boolean(session?.user?.id),
      },
    });
  } catch (error) {
    console.error("POST /api/predictor failed", error);
    return serverError();
  }
}
