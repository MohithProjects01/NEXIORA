import { auth } from "@/lib/auth";
import { created, ok, serverError, unauthorized, zodErrorResponse } from "@/lib/http";
import { savedCollegeSchema } from "@/lib/validations/saved";
import {
  listSavedColleges,
  removeSavedCollege,
  saveCollege,
} from "@/services/saved-college.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    return ok({
      colleges: await listSavedColleges(session.user.id),
    });
  } catch (error) {
    console.error("GET /api/saved failed", error);
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = savedCollegeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await saveCollege(session.user.id, parsed.data.collegeId);

    return created({ message: "College saved successfully" });
  } catch (error) {
    console.error("POST /api/saved failed", error);
    return serverError();
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = savedCollegeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await removeSavedCollege(session.user.id, parsed.data.collegeId);
    return ok({ message: "College removed successfully" });
  } catch (error) {
    console.error("DELETE /api/saved failed", error);
    return serverError();
  }
}
