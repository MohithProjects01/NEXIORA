import { auth } from "@/lib/auth";
import { notFound, ok, serverError, unauthorized } from "@/lib/http";
import { deleteComparison } from "@/services/comparison.service";

type Params = Promise<{ id: string }>;

export async function DELETE(
  _request: Request,
  { params }: { params: Params }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const { id } = await params;
    const deleted = await deleteComparison(session.user.id, id);

    if (!deleted) {
      return notFound("Comparison not found");
    }

    return ok({ message: "Comparison deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/compare/[id] failed", error);
    return serverError();
  }
}
