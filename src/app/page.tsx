import Link from "next/link";
import { ArrowRight, BrainCircuit, GitCompareArrows, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { FEATURED_STATS } from "@/lib/constants";
import { getFeaturedColleges } from "@/services/college.service";
import { SearchBar } from "@/components/colleges/search-bar";
import { CollegeGrid } from "@/components/colleges/college-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const session = await auth();
  const featuredColleges = await getFeaturedColleges(session?.user?.id, 6);

  return (
    <div className="mesh-gradient">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Badge className="bg-brand-500/15 text-brand-100">
              Production-ready college discovery MVP
            </Badge>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the right college with intelligent discovery, side-by-side
              comparisons, and admission predictions.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-surface-300">
              CollegeCompass AI helps students shortlist colleges, evaluate outcomes,
              compare options, track saves, and estimate admission chances across
              JEE Main, KCET, and COMEDK.
            </p>
            <div className="mt-8 max-w-3xl">
              <SearchBar />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/colleges">
                <Button size="lg">
                  Explore Colleges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/predictor">
                <Button variant="secondary" size="lg">
                  Try Predictor
                </Button>
              </Link>
            </div>
          </div>

          <Card className="gradient-card">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-brand-300" />
                  <div>
                    <p className="font-semibold text-white">Smart discovery</p>
                    <p className="text-sm text-surface-400">
                      Search colleges by state, city, ownership, fees, rating, and course.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <GitCompareArrows className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="font-semibold text-white">Decision workflow</p>
                    <p className="text-sm text-surface-400">
                      Compare up to three colleges across placements, fees, ratings, and courses.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="font-semibold text-white">Prediction engine</p>
                    <p className="text-sm text-surface-400">
                      Estimate likely matches using realistic rank bands and college strength signals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {FEATURED_STATS.map((stat) => (
            <Card key={stat.label} className="p-5">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-surface-400">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">Featured Colleges</h2>
            <p className="mt-2 text-surface-400">
              High-performing institutions with strong placements, outcomes, and student sentiment.
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="outline">View all colleges</Button>
          </Link>
        </div>
        <CollegeGrid colleges={featuredColleges} />
      </section>
    </div>
  );
}
