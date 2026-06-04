import { auth } from "@/lib/auth";
import {
  conflict,
  created,
  serverError,
  unauthorized,
  zodErrorResponse,
  ok,
} from "@/lib/http";
import { sanitizeText } from "@/lib/sanitize";
import { reviewSchema } from "@/lib/validations/review";
import { createReview, getCollegeReviews } from "@/services/review.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return ok({
        reviews: [],
        stats: { averageRating: 0, totalReviews: 0, distribution: {} },
      });
    }

    const reviews = await getCollegeReviews(collegeId);
    return ok(reviews);
  } catch (error) {
    console.error("GET /api/reviews failed", error);
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = reviewSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const review = await createReview(session.user.id, {
      ...parsed.data,
      comment: sanitizeText(parsed.data.comment),
    });

    return created({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("POST /api/reviews failed", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return conflict("You have already reviewed this college");
    }

    return serverError();
  }
}
