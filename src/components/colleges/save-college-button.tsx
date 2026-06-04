"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function SaveCollegeButton({
  collegeId,
  initialSaved = false,
}: {
  collegeId: string;
  initialSaved?: boolean;
}) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/saved", {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeId }),
      });

      if (!response.ok) {
        throw new Error("Unable to update saved state");
      }

      return response.json();
    },
    onMutate: async () => {
      setIsSaved((current) => !current);
    },
    onError: () => {
      setIsSaved((current) => !current);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
    },
  });

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          Save
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}
