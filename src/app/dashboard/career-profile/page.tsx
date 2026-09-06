"use client";

import ProfileCollections, { profileFields, type Collections } from "@/components/custom/ProfileCollections";
import { FormEvent, useEffect, useState } from "react";
import { Check, Loader2, UserRoundCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCareerProfile,
  useUpdateCareerProfile,
} from "@/lib/queryHooks/careerProfileHooks";
import type {
  CareerProfile,
  Completeness,
} from "@/lib/types/careerProfileTypes";

const TEXT_FIELDS = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "jobTitle", label: "Current or target job title" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Location" },
  { key: "website", label: "Website" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
] as const;

const CompletenessMeter = ({ completeness }: { completeness: Completeness }) => (
  <div className="rounded-xl border bg-card p-5">
    <div className="flex items-baseline justify-between">
      <h2 className="text-sm font-semibold">Profile completeness</h2>
      <span className="text-2xl font-bold text-primary">
        {completeness.score}%
      </span>
    </div>

    <div
      className="mt-3 h-2 w-full rounded-full bg-secondary"
      role="progressbar"
      aria-valuenow={completeness.score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Career profile completeness"
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${completeness.score}%` }}
      />
    </div>

    <ul className="mt-4 space-y-1.5">
      {completeness.sections.map((section) => (
        <li
          key={section.key}
          className={`flex items-center gap-2 text-sm ${
            section.complete ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {section.complete ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <span
              className="h-4 w-4 rounded-full border border-border"
              aria-hidden
            />
          )}
          {section.label}
          {!section.complete && (
            <span className="text-xs text-muted-foreground">
              (+{section.weight}%)
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const CareerProfilePage = () => {
  const { data, isLoading, isError } = useCareerProfile();
  const { mutate: save, isPending, error: saveError } = useUpdateCareerProfile();

  const [form, setForm] = useState<Record<string, string>>({});
  const [collections, setCollections] = useState<Collections>({});
  const [interests, setInterests] = useState("");
  const [targetRoles, setTargetRoles] = useState("");

  const profile: CareerProfile | undefined = data?.profile;
  const completeness: Completeness | undefined = data?.completeness;

  useEffect(() => {
    if (!profile) return;
    const next: Record<string, string> = {};
    for (const { key } of TEXT_FIELDS) next[key] = profile[key] ?? "";
    next.summary = profile.summary ?? "";
    setForm(next);
    setCollections(Object.fromEntries(Object.keys(profileFields).map(key => [key, (profile as unknown as Collections)[key] ?? []])));
    setInterests(((profile as unknown as { interests?: string[] }).interests ?? []).join(", "));
    setTargetRoles((profile.preferences?.targetRoles ?? []).join(", "));
  }, [profile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save({
      ...form,
      ...collections,
      interests: interests.split(",").map(s => s.trim()).filter(Boolean),
      preferences: {
        targetRoles: targetRoles
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      },
    });
  };

  if (isError) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-destructive">
          We couldn&apos;t load your career profile. Please refresh and try
          again.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <UserRoundCog className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Career profile</h1>
            <p className="text-sm text-muted-foreground">
              Your master record. Every resume can be built from it, so you only
              enter this once.
            </p>
          </div>
        </div>

        {isLoading || !profile || !completeness ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <CompletenessMeter completeness={completeness} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset disabled={isPending} className="min-w-0 space-y-6">
              <div className="rounded-xl border bg-card p-5">
                <h2 className="text-sm font-semibold">Personal details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {TEXT_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label
                        htmlFor={key}
                        className="text-xs font-bold text-foreground"
                      >
                        {label}
                      </label>
                      <Input
                        id={key}
                        className="mt-1"
                        value={form[key] ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <h2 className="text-sm font-semibold">Professional summary</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">Rough notes are enough here. You can also draft a polished summary in AI studio.</p>
                <Textarea
                  className="mt-4"
                  rows={5}
                  value={form.summary ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, summary: e.target.value }))
                  }
                  placeholder="A few lines about your experience and what you're looking for."
                />
              </div>

              <div className="rounded-xl border bg-card p-5">
                <h2 className="text-sm font-semibold">Target roles</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Which roles are you working toward? Separate multiple roles with commas.
                </p>
                <Input
                  className="mt-3"
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  placeholder="Backend Engineer, Platform Engineer"
                />
              </div>

              <ProfileCollections values={collections} onChange={setCollections}/>
              <label className="block text-sm">Interests (comma separated)<Input value={interests} onChange={e => setInterests(e.target.value)}/></label>

              <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
                <Button type="submit" disabled={isPending} className="flex gap-2">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save profile
                </Button>
              </div>
              </fieldset>
              {saveError && <p role="alert" className="text-sm text-red-300">Your profile could not be saved. Review the error message and try again; your edits are still here.</p>}
            </form>
          </div>
        )}
    </main>
  );
};

export default CareerProfilePage;
