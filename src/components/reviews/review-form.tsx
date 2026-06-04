"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, updateReviewSchema } from "@/lib/validations/review";

type ReviewFormProps = {
  collegeId: string;
  reviewId?: string;
  defaultValues?: {
    rating: number;
    comment: string;
  };
};

export function ReviewForm({ collegeId, reviewId, defaultValues }: ReviewFormProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(reviewId ? updateReviewSchema : reviewSchema),
    defaultValues: {
      collegeId,
      rating: defaultValues?.rating ?? 4,
      comment: defaultValues?.comment ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus(null);
    const response = await fetch(reviewId ? `/api/reviews/${reviewId}` : "/api/reviews", {
      method: reviewId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.message ?? "Unable to submit review");
      return;
    }

    setStatus(reviewId ? "Review updated" : "Review submitted");
    queryClient.invalidateQueries({ queryKey: ["reviews", collegeId] });
    form.reset({
      collegeId,
      rating: reviewId ? values.rating : 4,
      comment: reviewId ? values.comment : "",
    });
  });

  if (!session?.user) {
    return (
      <Card>
        <h3 className="text-xl font-semibold text-white">Write a review</h3>
        <p className="mt-2 text-sm text-surface-400">
          Sign in to share your experience and rate this college.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button>Login to review</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-white">
        {reviewId ? "Edit your review" : "Write a review"}
      </h3>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {!reviewId ? <input type="hidden" {...form.register("collegeId")} /> : null}
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            {...form.register("rating", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="comment">Review</Label>
          <Textarea id="comment" {...form.register("comment")} />
        </div>
        {status ? <p className="text-sm text-surface-300">{status}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : reviewId
              ? "Update Review"
              : "Submit Review"}
        </Button>
      </form>
    </Card>
  );
}
