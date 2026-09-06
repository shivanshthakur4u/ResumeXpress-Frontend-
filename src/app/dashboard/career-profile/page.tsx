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
  <div className="rounded-lg border p-5">
    <div className="flex items-baseline justify-between">
      <h2 className="font-bold">Profile completeness</h2>
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

// Experience, education and skills are edited in the resume editor and promoted
// here with "Save to career profile", rather than maintained in two places.
const SyncedSections = ({ profile }: { profile: CareerProfile }) => {
  const counts = [
    { label: "Work experience", value: profile.experience?.length ?? 0 },
    { label: "Education", value: profile.education?.length ?? 0 },
    { label: "Skills", value: profile.skills?.length ?? 0 },
  ];

  return (
    <div className="rounded-lg border p-5">
      <h2 className="font-bold">From your resumes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit these in a resume, then use{" "}
        <span className="font-medium">Save to career profile</span> to bring them
        here. Any resume can then import them back.
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-4">
        {counts.map((c) => (
          <div key={c.label}>
            <dt className="text-xs text-muted-foreground">{c.label}</dt>
            <dd className="text-xl font-semibold">{c.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const CareerProfilePage = () => {
  const { data, isLoading, isError } = useCareerProfile();
  const { mutate: save, isPending } = useUpdateCareerProfile();

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
              <div className="rounded-lg border p-5">
                <h2 className="font-bold">Personal details</h2>
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

              <div className="rounded-lg border p-5">
                <h2 className="font-bold">Professional summary</h2>
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

              <div className="rounded-lg border p-5">
                <h2 className="font-bold">Target roles</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comma separated. Used to tailor resumes to the roles you want.
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

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="flex gap-2">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save profile
                </Button>
              </div>
            </form>
          </div>
        )}
    </main>
  );
};

export default CareerProfilePage;
