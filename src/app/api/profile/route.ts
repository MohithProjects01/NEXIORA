import { auth } from "@/lib/auth";
import { ok, serverError, unauthorized, zodErrorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { profileUpdateSchema } from "@/lib/validations/profile";
import { getUserProfile } from "@/services/user.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const profile = await getUserProfile(session.user.id);
    return ok({ profile });
  } catch (error) {
    console.error("GET /api/profile failed", error);
    return serverError();
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = profileUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: sanitizeText(parsed.data.name),
      },
    });

    return ok({
      message: "Profile updated successfully",
      profile: await getUserProfile(session.user.id),
    });
  } catch (error) {
    console.error("PUT /api/profile failed", error);
    return serverError();
  }
}
