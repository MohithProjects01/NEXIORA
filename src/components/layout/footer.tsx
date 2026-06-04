import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-surface-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-base font-semibold text-surface-100">{APP_NAME}</p>
          <p className="mt-2 max-w-xl">
            Production-style college discovery, comparison, and admission prediction
            workflow built for a full stack engineering evaluation.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/colleges" className="hover:text-white">
            Colleges
          </Link>
          <Link href="/compare" className="hover:text-white">
            Compare
          </Link>
          <Link href="/predictor" className="hover:text-white">
            Predictor
          </Link>
          <Link href="/saved" className="hover:text-white">
            Saved
          </Link>
        </div>
      </div>
    </footer>
  );
}
