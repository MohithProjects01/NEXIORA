"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu, Moon, Scale, Sun } from "lucide-react";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCompare } from "@/hooks/use-compare";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { compareIds } = useCompare();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand text-sm font-bold text-white">
            CC
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-white">{APP_NAME}</p>
            <p className="text-xs text-surface-400">Discover. Compare. Decide.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm text-surface-300 transition hover:bg-white/5 hover:text-white",
                pathname === link.href && "bg-white/5 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link href="/compare" className="relative">
            <Button variant="secondary" size="sm">
              <Scale className="mr-2 h-4 w-4" />
              Compare
            </Button>
            {compareIds.length > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
                {compareIds.length}
              </span>
            ) : null}
          </Link>
          {session?.user ? (
            <>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  {session.user.name.split(" ")[0]}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm text-surface-200 hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              {session?.user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
