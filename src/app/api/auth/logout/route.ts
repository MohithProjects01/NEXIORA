import { ok, serverError } from "@/lib/http";
import { signOut } from "@/lib/auth";

export async function POST() {
  try {
    await signOut({ redirect: false, redirectTo: "/" });
    return ok({ message: "Logged out successfully" });
  } catch (error) {
    console.error("POST /api/auth/logout failed", error);
    return serverError();
  }
}
