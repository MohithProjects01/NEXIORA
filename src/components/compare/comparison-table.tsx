import Link from "next/link";
import { DeleteComparisonButton } from "@/components/compare/delete-comparison-button";
import { Card } from "@/components/ui/card";
import type { ComparisonData } from "@/types/comparison";

const rows: Array<{
  label: string;
  key:
    | "fees"
    | "rating"
    | "placementPercentage"
    | "highestPackage"
    | "averagePackage"
    | "ownership"
    | "location"
    | "establishedYear";
}> = [
  { label: "Fees", key: "fees" },
  { label: "Rating", key: "rating" },
  { label: "Placement %", key: "placementPercentage" },
  { label: "Highest Package", key: "highestPackage" },
  { label: "Average Package", key: "averagePackage" },
  { label: "Ownership", key: "ownership" },
  { label: "Location", key: "location" },
  { label: "Established", key: "establishedYear" },
];

export function ComparisonTable({
  comparison,
  title,
  showDelete = false,
}: {
  comparison: ComparisonData;
  title?: string;
  showDelete?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title ?? comparison.title}</h2>
          <p className="mt-2 text-sm text-surface-400">
            Compare fees, placements, packages, ownership, location, and offered courses side by side.
          </p>
        </div>
        {showDelete && comparison.id !== "preview" ? (
          <DeleteComparisonButton comparisonId={comparison.id} />
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-surface-400">Metric</th>
              {comparison.colleges.map((college) => (
                <th key={college.id} className="px-4 py-3">
                  <Link href={`/college/${college.slug}`} className="text-white hover:text-brand-300">
                    {college.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-white/5">
                <td className="px-4 py-3 font-medium text-surface-300">{row.label}</td>
                {comparison.colleges.map((college) => (
                  <td key={college.id + row.key} className="px-4 py-3 text-surface-100">
                    {college[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 font-medium text-surface-300">Courses Offered</td>
              {comparison.colleges.map((college) => (
                <td key={college.id + "courses"} className="px-4 py-3 text-surface-100">
                  {college.courses.slice(0, 5).join(", ")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
