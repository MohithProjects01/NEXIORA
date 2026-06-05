"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OWNERSHIP_OPTIONS, STATES } from "@/lib/constants";
import type { CollegeCard } from "@/types/college";

const adminCollegeFormSchema = z.object({
  slug: z.string().min(2).max(150).trim(),
  name: z.string().min(2).max(160).trim(),
  description: z.string().min(30).max(5000).trim(),
  location: z.string().min(2).max(80).trim(),
  state: z.string().min(2).max(80).trim(),
  ownership: z.enum(["GOVERNMENT", "PRIVATE"]),
  fees: z.number().min(0),
  rating: z.number().min(0).max(5),
  placementPercentage: z.number().min(0).max(100),
  averagePackage: z.number().min(0),
  highestPackage: z.number().min(0),
  website: z.string().optional(),
  topRecruiters: z.string().min(2),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()),
  featured: z.boolean().optional(),
});

type AdminCollegeFormInput = z.infer<typeof adminCollegeFormSchema>;

const defaultValues: AdminCollegeFormInput = {
  slug: "",
  name: "",
  description: "",
  location: "Bengaluru",
  state: "Karnataka",
  ownership: "PRIVATE",
  fees: 250000,
  rating: 4,
  placementPercentage: 85,
  averagePackage: 8,
  highestPackage: 18,
  website: "",
  topRecruiters: "TCS, Infosys, Wipro",
  establishedYear: 2005,
  featured: false,
};

function toPayload(values: AdminCollegeFormInput) {
  return {
    ...values,
    website: values.website?.trim() || undefined,
    topRecruiters: values.topRecruiters
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    featured: Boolean(values.featured),
  };
}

export function CollegeAdminPanel({ colleges }: { colleges: CollegeCard[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdminCollegeFormInput>({
    resolver: zodResolver(adminCollegeFormSchema),
    defaultValues,
  });

  const resetForm = () => {
    setEditingId(null);
    form.reset(defaultValues);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setMessage(null);
    setError(null);

    const payload = toPayload(values);
    const response = await fetch(
      editingId ? `/api/colleges/${editingId}` : "/api/colleges",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.message ?? "Unable to save college");
      return;
    }

    setMessage(editingId ? "College updated successfully" : "College created successfully");
    resetForm();
    router.refresh();
  });

  const startEdit = async (collegeId: string) => {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/colleges/${collegeId}`);
    const result = await response.json();

    if (!response.ok || !result.college) {
      setError("Unable to load college details");
      return;
    }

    const college = result.college;
    setEditingId(collegeId);
    form.reset({
      slug: college.slug,
      name: college.name,
      description: college.description,
      location: college.location,
      state: college.state,
      ownership: college.ownership,
      fees: college.fees,
      rating: college.rating,
      placementPercentage: college.placementPercentage,
      averagePackage: college.averagePackage,
      highestPackage: college.highestPackage,
      website: college.website ?? "",
      topRecruiters: college.topRecruiters.join(", "),
      establishedYear: college.establishedYear,
      featured: college.featured,
    });
  };

  const deleteCollege = async (collegeId: string) => {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/colleges/${collegeId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.message ?? "Unable to delete college");
      return;
    }

    if (editingId === collegeId) {
      resetForm();
    }

    setMessage("College deleted successfully");
    router.refresh();
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h2 className="text-2xl font-semibold text-white">Manage colleges</h2>
        <p className="mt-2 text-sm text-surface-400">
          Create, update, or remove colleges from the directory.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-surface-400">
              <tr>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Location</th>
                <th className="py-3 pr-4">Rating</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((college) => (
                <tr key={college.id} className="border-b border-white/5 text-surface-100">
                  <td className="py-3 pr-4 font-medium text-white">{college.name}</td>
                  <td className="py-3 pr-4">
                    {college.location}, {college.state}
                  </td>
                  <td className="py-3 pr-4">{college.rating.toFixed(1)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(college.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCollege(college.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editingId ? "Edit college" : "Add college"}
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              {editingId
                ? "Update the selected college and save your changes."
                : "Create a new college entry for the discovery directory."}
            </p>
          </div>
          {editingId ? (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register("slug")} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="ownership">Ownership</Label>
              <Select id="ownership" {...form.register("ownership")}>
                {OWNERSHIP_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="establishedYear">Established year</Label>
              <Input
                id="establishedYear"
                type="number"
                {...form.register("establishedYear", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fees">Annual fees</Label>
              <Input id="fees" type="number" {...form.register("fees", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                {...form.register("rating", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="placementPercentage">Placement %</Label>
              <Input
                id="placementPercentage"
                type="number"
                {...form.register("placementPercentage", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="averagePackage">Avg package (LPA)</Label>
              <Input
                id="averagePackage"
                type="number"
                step="0.1"
                {...form.register("averagePackage", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="highestPackage">Highest package (LPA)</Label>
              <Input
                id="highestPackage"
                type="number"
                step="0.1"
                {...form.register("highestPackage", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...form.register("website")} />
          </div>

          <div>
            <Label htmlFor="topRecruiters">Top recruiters (comma-separated)</Label>
            <Input id="topRecruiters" {...form.register("topRecruiters")} />
          </div>

          <label className="flex items-center gap-2 text-sm text-surface-200">
            <input type="checkbox" {...form.register("featured")} />
            Feature on homepage
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : editingId
                ? "Update college"
                : "Create college"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
