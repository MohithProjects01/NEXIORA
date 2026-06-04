import { auth } from "@/lib/auth";
import { ok, serverError } from "@/lib/http";

export async function GET() {
  try {
    return ok({
      session: await auth(),
    });
  } catch (error) {
    console.error("GET /api/auth/session failed", error);
    return serverError();
  }
}
