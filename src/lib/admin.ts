import type { Session } from "next-auth";
import { forbidden, unauthorized } from "@/lib/http";

export function getAdminEmails() {
  const raw =
    process.env.ADMIN_EMAILS ??
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
    "demo@collegecompass.ai";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function assertAdmin(session: Session | null) {
  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!isAdminEmail(session.user.email)) {
    return forbidden("Admin access required");
  }

  return null;
}
