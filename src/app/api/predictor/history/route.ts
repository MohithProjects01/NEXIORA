import { auth } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/http";
import { getPredictionHistory } from "@/services/predictor.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const history = await getPredictionHistory(session.user.id);
    return ok({ history });
  } catch (error) {
    console.error("GET /api/predictor/history failed", error);
    return serverError();
  }
}
