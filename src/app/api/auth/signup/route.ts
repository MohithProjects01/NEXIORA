import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { signupSchema } from "@/lib/validations/auth";
import { conflict, created, serverError, tooManyRequests, zodErrorResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const ipKey =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "local";
    const rate = checkRateLimit(`signup:${ipKey}`, { limit: 10, windowMs: 60_000 });

    if (!rate.allowed) {
      return tooManyRequests();
    }

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return conflict("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: sanitizeText(name),
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return created({ message: "Account created successfully", user });
  } catch (error) {
    console.error("Signup error:", error);
    return serverError();
  }
}
