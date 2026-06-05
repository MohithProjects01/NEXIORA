import type { NextAuthConfig } from "next-auth";
import { isAdminEmail } from "@/lib/admin";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ["/saved", "/profile"];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/login", nextUrl.origin);
        redirectUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      if (nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/login", nextUrl.origin);
          redirectUrl.searchParams.set("callbackUrl", nextUrl.href);
          return Response.redirect(redirectUrl);
        }

        if (!isAdminEmail(auth?.user?.email)) {
          return Response.redirect(new URL("/", nextUrl.origin));
        }
      }

      // Redirect logged-in users away from auth pages
      const authPaths = ["/login", "/signup"];
      const isAuthPage = authPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl.origin));
      }

      return true;
    },
  },
  providers: [],
};
