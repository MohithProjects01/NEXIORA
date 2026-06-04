import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/auth";
import {
  ok,
  serverError,
  tooManyRequests,
  unauthorized,
  zodErrorResponse,
} from "@/lib/http";

export async function POST(request: Request) {
  try {
    const ipKey =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "local";
    const rate = checkRateLimit(`login:${ipKey}`, { limit: 10, windowMs: 60_000 });

    if (!rate.allowed) {
      return tooManyRequests();
    }

    const parsed = loginSchema.safeParse(await request.json());

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    try {
      await signIn("credentials", {
        ...parsed.data,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return unauthorized("Invalid email or password");
      }

      throw error;
    }

    return ok({
      message: "Logged in successfully",
      session: await auth(),
    });
  } catch (error) {
    console.error("POST /api/auth/login failed", error);
    return serverError();
  }
}
