import Link from "next/link";
import { ArrowUpRight, Landmark, MapPin, Trophy, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompareToggle } from "@/components/colleges/compare-toggle";
import { SaveCollegeButton } from "@/components/colleges/save-college-button";
import { RatingStars } from "@/components/reviews/rating-stars";
import type { CollegeCard as CollegeCardType } from "@/types/college";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export function CollegeCard({ college }: { college: CollegeCardType }) {
  return (
    <Card className="card-hover flex h-full flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{college.ownership}</Badge>
              {college.featured ? <Badge className="bg-brand-500/15 text-brand-200">Featured</Badge> : null}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">{college.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-surface-400">
              <MapPin className="h-4 w-4" />
              <span>
                {college.location}, {college.state}
              </span>
            </div>
          </div>
          <Link href={`/college/${college.slug}`} className="text-surface-300 hover:text-white">
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        <RatingStars rating={college.rating} className="mt-4" />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-surface-400">
              <Wallet className="h-4 w-4" />
              Fees
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              {formatCurrency(college.fees)} / year
            </p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-surface-400">
              <Trophy className="h-4 w-4" />
              Placement
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              {formatPercentage(college.placementPercentage)}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-surface-400">
              <Landmark className="h-4 w-4" />
              Highest Package
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              {college.highestPackage.toFixed(1)} LPA
            </p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-surface-400">Established</div>
            <p className="mt-1 text-sm font-semibold text-white">{college.establishedYear}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <SaveCollegeButton collegeId={college.id} initialSaved={college.isSaved} />
        <CompareToggle collegeId={college.id} />
        <Link href={`/college/${college.slug}`} className="ml-auto">
          <Badge className="cursor-pointer hover:bg-white/10">View Details</Badge>
        </Link>
      </div>
    </Card>
  );
}
