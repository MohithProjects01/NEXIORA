import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="mx-auto h-96 w-full max-w-md rounded-lg bg-surface-900" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
