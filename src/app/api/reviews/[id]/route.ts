import { forbidden, notFound, ok, serverError, unauthorized, zodErrorResponse } from "@/lib/http";
import { auth } from "@/lib/auth";
import { updateReviewSchema } from "@/lib/validations/review";
import { deleteReview, updateReview } from "@/services/review.service";

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: ReviewRouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = updateReviewSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id } = await context.params;
    const result = await updateReview(id, session.user.id, parsed.data);

    if (!result) {
      return notFound("Review not found");
    }

    if (result === "FORBIDDEN") {
      return forbidden("You can only edit your own review");
    }

    return ok({
      message: "Review updated successfully",
      review: result,
    });
  } catch (error) {
    console.error("PUT /api/reviews/[id] failed", error);
    return serverError();
  }
}

export async function DELETE(
  _request: Request,
  context: ReviewRouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const { id } = await context.params;
    const result = await deleteReview(id, session.user.id);

    if (!result) {
      return notFound("Review not found");
    }

    if (result === "FORBIDDEN") {
      return forbidden("You can only delete your own review");
    }

    return ok({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] failed", error);
    return serverError();
  }
}
