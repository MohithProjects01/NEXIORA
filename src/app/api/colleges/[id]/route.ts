import { assertAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import {
  created,
  notFound,
  ok,
  serverError,
  zodErrorResponse,
} from "@/lib/http";
import { sanitizeStringArray, sanitizeText } from "@/lib/sanitize";
import { collegeUpdateSchema } from "@/lib/validations/college";
import {
  deleteCollege,
  getCollegeById,
  updateCollege,
} from "@/services/college.service";

type CollegeRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: CollegeRouteContext
) {
  try {
    const { id } = await context.params;
    const session = await auth();
    const college = await getCollegeById(id, session?.user?.id);

    if (!college) {
      return notFound("College not found");
    }

    return ok({ college });
  } catch (error) {
    console.error("GET /api/colleges/[id] failed", error);
    return serverError();
  }
}

export async function PUT(
  request: Request,
  context: CollegeRouteContext
) {
  try {
    const session = await auth();
    const adminError = assertAdmin(session);

    if (adminError) {
      return adminError;
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = collegeUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const college = await updateCollege(id, {
      ...parsed.data,
      ...(parsed.data.description
        ? { description: sanitizeText(parsed.data.description) }
        : {}),
      ...(parsed.data.topRecruiters
        ? { topRecruiters: sanitizeStringArray(parsed.data.topRecruiters) }
        : {}),
    });

    return created({
      message: "College updated successfully",
      college,
    });
  } catch (error) {
    console.error("PUT /api/colleges/[id] failed", error);
    return serverError();
  }
}

export async function DELETE(
  _request: Request,
  context: CollegeRouteContext
) {
  try {
    const session = await auth();
    const adminError = assertAdmin(session);

    if (adminError) {
      return adminError;
    }

    const { id } = await context.params;
    await deleteCollege(id);
    return ok({ message: "College deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/colleges/[id] failed", error);
    return serverError();
  }
}
