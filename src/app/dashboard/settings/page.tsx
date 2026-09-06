"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCareerProfile, useUpdateCareerProfile } from "@/lib/queryHooks/careerProfileHooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const listFields = ["targetRoles", "targetIndustries", "employmentTypes", "locations"];
const textFields = ["remotePreference", "salaryExpectation", "noticePeriod"];
const label = (value: string) => value.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
export default function SettingsPage() {
  const { data, isLoading, isError } = useCareerProfile(); const save = useUpdateCareerProfile();
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => { if (data?.profile?.preferences) setValues(Object.fromEntries([...listFields, ...textFields].map(key => [key, Array.isArray(data.profile.preferences[key]) ? data.profile.preferences[key].join(", ") : data.profile.preferences[key] ?? ""]))); }, [data]);
  return <div className="mx-auto max-w-3xl space-y-6 p-6"><h1 className="text-3xl font-semibold">Settings</h1><p className="text-muted-foreground">Career preferences guide the context used by your career tools.</p>{isError ? <p role="alert">Could not load settings.</p> : isLoading ? <p role="status">Loading...</p> : <form className="space-y-4 rounded-xl border p-5" onSubmit={e => { e.preventDefault(); save.mutate({ preferences: Object.fromEntries([...listFields, ...textFields].map(key => [key, listFields.includes(key) ? (values[key] ?? "").split(",").map(s => s.trim()).filter(Boolean) : values[key] ?? ""])) }); }}>{[...listFields, ...textFields].map(key => <label className="block text-sm" key={key}>{label(key)}{listFields.includes(key) && " (comma separated)"}<Input value={values[key] ?? ""} onChange={e => setValues({ ...values, [key]: e.target.value })}/></label>)}<Button disabled={save.isPending}>Save preferences</Button></form>}<Link className="block underline" href="/dashboard/career-profile">Edit personal information</Link></div>;
}
