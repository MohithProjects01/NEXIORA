import { auth } from "@/lib/auth";
import {
  created,
  ok,
  serverError,
  unauthorized,
  zodErrorResponse,
} from "@/lib/http";
import { parseArrayParam } from "@/lib/query-params";
import { compareSchema } from "@/lib/validations/compare";
import {
  buildComparisonPreview,
  createComparison,
  listComparisons,
} from "@/services/comparison.service";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const collegeIds = parseArrayParam(searchParams.get("collegeIds"));

    if (collegeIds?.length) {
      return ok({
        comparison: await buildComparisonPreview(collegeIds),
      });
    }

    if (!session?.user?.id) {
      return ok({ comparisons: [] });
    }

    return ok({
      comparisons: await listComparisons(session.user.id),
    });
  } catch (error) {
    console.error("GET /api/compare failed", error);
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = compareSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const comparison = await createComparison(session.user.id, parsed.data);

    return created({
      message: "Comparison saved successfully",
      comparison,
    });
  } catch (error) {
    console.error("POST /api/compare failed", error);
    return serverError();
  }
}
