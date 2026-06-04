"use client";

import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/use-compare";

export function CompareToggle({ collegeId }: { collegeId: string }) {
  const { compareIds, toggleCompare, canAddMore } = useCompare();
  const selected = compareIds.includes(collegeId);

  return (
    <Button
      variant={selected ? "secondary" : "ghost"}
      size="sm"
      disabled={!selected && !canAddMore}
      onClick={() => toggleCompare(collegeId)}
    >
      <GitCompareArrows className="mr-2 h-4 w-4" />
      {selected ? "Selected" : "Compare"}
    </Button>
  );
}
