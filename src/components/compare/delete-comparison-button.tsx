"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteComparisonButton({ comparisonId }: { comparisonId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        const response = await fetch(`/api/compare/${comparisonId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.refresh();
        }
      }}
    >
      Delete
    </Button>
  );
}
