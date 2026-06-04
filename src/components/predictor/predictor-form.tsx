"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CATEGORY_OPTIONS, EXAM_OPTIONS, STATES } from "@/lib/constants";
import { predictorSchema, type PredictorInput } from "@/lib/validations/predictor";
import type { PredictionHistoryItem, PredictionResult } from "@/types/predictor";

export function PredictorForm({
  history = [],
}: {
  history?: PredictionHistoryItem[];
}) {
  const form = useForm<PredictorInput>({
    resolver: zodResolver(predictorSchema),
    defaultValues: {
      exam: "JEE_MAIN",
      rank: 25000,
      category: "GENERAL",
      state: "Karnataka",
    },
  });

  const prediction = useMutation({
    mutationFn: async (values: PredictorInput) => {
      const response = await fetch("/api/predictor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Unable to run prediction");
      return payload as { results: PredictionResult[]; meta: { savedToHistory: boolean } };
    },
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <h2 className="text-2xl font-semibold text-white">Predict admission chances</h2>
        <p className="mt-2 text-sm text-surface-400">
          Use exam, rank, category, and home state to get realistic shortlist recommendations.
        </p>

        <form
          onSubmit={form.handleSubmit((values) => prediction.mutate(values))}
          className="mt-6 space-y-4"
        >
          <div>
            <Label htmlFor="exam">Exam</Label>
            <Select id="exam" {...form.register("exam")}>
              {EXAM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" type="number" {...form.register("rank", { valueAsNumber: true })} />
            <p className="mt-1 text-xs text-rose-300">{form.formState.errors.rank?.message}</p>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" {...form.register("category")}>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select id="state" {...form.register("state")}>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={prediction.isPending}>
            {prediction.isPending ? "Calculating..." : "Predict Colleges"}
          </Button>
          {prediction.error ? (
            <p className="text-sm text-rose-300">{prediction.error.message}</p>
          ) : null}
        </form>
      </Card>

      <div className="space-y-6">
        <Card>
          <h3 className="text-xl font-semibold text-white">Recommended colleges</h3>
          <div className="mt-4 space-y-4">
            {(prediction.data?.results ?? []).length ? (
              prediction.data!.results.map((result) => (
                <div
                  key={result.college.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/college/${result.college.slug}`}
                        className="text-lg font-semibold text-white hover:text-brand-300"
                      >
                        {result.college.name}
                      </Link>
                      <p className="mt-1 text-sm text-surface-400">
                        {result.college.location}, {result.college.state}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-100">
                      {result.confidence} confidence
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-surface-400">Match</p>
                      <p className="text-lg font-semibold text-white">{result.matchPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-surface-400">Probability</p>
                      <p className="text-lg font-semibold text-white">{result.probabilityScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-surface-400">Placement</p>
                      <p className="text-lg font-semibold text-white">
                        {result.college.placementPercentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-surface-400">
                Run the predictor to see ranked recommendations.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white">Recent prediction history</h3>
          <div className="mt-4 space-y-3">
            {history.length ? (
              history.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">
                    {item.exam.replaceAll("_", " ")} · Rank {item.rank.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs text-surface-400">
                    {item.category} · {item.state} · {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-surface-400">
                Sign in and run predictions to build a history of your shortlist analysis.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
