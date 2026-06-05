"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations/profile";

export function ProfileSettingsForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { name: defaultName },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSuccess(null);
    setError(null);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? "Unable to update profile");
      return;
    }

    setSuccess("Profile updated successfully");
    router.refresh();
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">Account settings</h2>
      <p className="mt-2 text-sm text-surface-400">
        Update your display name used across reviews and your dashboard.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Display name</Label>
          <Input id="name" {...form.register("name")} />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name?.message}</p>
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
