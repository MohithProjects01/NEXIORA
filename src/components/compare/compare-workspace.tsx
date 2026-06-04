"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCompare } from "@/hooks/use-compare";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { ComparisonData } from "@/types/comparison";

export function CompareWorkspace() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { compareIds, clearCompare } = useCompare();

  const preview = useQuery({
    queryKey: ["compare-preview", compareIds],
    queryFn: async () => {
      const response = await fetch(`/api/compare?collegeIds=${compareIds.join(",")}`);
      const payload = await response.json();
      return payload.comparison as ComparisonData;
    },
    enabled: compareIds.length >= 2,
  });

  const saveComparison = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeIds: compareIds,
          title: "Saved comparison",
        }),
      });

      if (!response.ok) throw new Error("Unable to save comparison");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-comparisons"] });
    },
  });

  if (compareIds.length < 2) {
    return (
      <EmptyState
        title="Select at least 2 colleges"
        description="Use the compare button on college cards to add up to three colleges here."
        actionHref="/colleges"
        actionLabel="Browse colleges"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {session?.user ? (
          <Button onClick={() => saveComparison.mutate()} disabled={saveComparison.isPending}>
            {saveComparison.isPending ? "Saving..." : "Save Comparison"}
          </Button>
        ) : null}
        <Button variant="ghost" onClick={clearCompare}>
          Clear Selection
        </Button>
      </div>

      {preview.data ? (
        <ComparisonTable comparison={preview.data} title="Live comparison" />
      ) : (
        <EmptyState
          title="Preparing comparison"
          description="Select colleges from the directory to populate a side-by-side view."
        />
      )}
    </div>
  );
}
