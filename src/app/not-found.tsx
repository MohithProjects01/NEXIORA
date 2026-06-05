import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-surface-400">
          The page you are looking for does not exist or may have been moved. Try
          exploring colleges or return to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <Link href="/colleges">
            <Button variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Browse colleges
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
