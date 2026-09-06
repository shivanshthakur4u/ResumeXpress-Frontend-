"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export const profileFields: Record<string, string[]> = {
  experience: ["title", "companyName", "city", "state", "startDate", "endDate", "currentlyWorking", "workSummary"],
  education: ["universityName", "degree", "major", "startDate", "endDate", "currentlyStudying", "description"],
  skills: ["name", "rating", "category"],
  projects: ["name", "role", "description", "url", "technologies", "startDate", "endDate"],
  certifications: ["name", "issuer", "issueDate", "expiryDate", "credentialId", "url"],
  achievements: ["title", "description", "date"], awards: ["title", "issuer", "date", "description"],
  publications: ["title", "publisher", "date", "url", "description"], volunteer: ["organization", "role", "startDate", "endDate", "description"],
  languages: ["name", "proficiency"],
};
const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
type Entry = Record<string, string | number | boolean | string[]>;
export type Collections = Record<string, Entry[]>;
export default function ProfileCollections({ values, onChange, sections, partialDates = false }: { partialDates?: boolean; values: Collections; onChange: (values: Collections) => void; sections?: string[] }) {
  return <div className="space-y-3">{Object.entries(profileFields).filter(([section]) => !sections || sections.includes(section)).map(([section, fields]) => {
    const entries = values[section] ?? [];
    const update = (i: number, field: string, value: Entry[string]) => onChange({ ...values, [section]: entries.map((entry, n) => n === i ? { ...entry, [field]: value } : entry) });
    return <details key={section} open={!!sections} className="rounded-lg border p-4"><summary className="cursor-pointer font-semibold">{label(section)} <span className="text-sm font-normal text-muted-foreground">({entries.length})</span></summary><div className="mt-4 space-y-4">{entries.map((entry, i) => <fieldset key={i} className="grid gap-3 rounded border p-3 sm:grid-cols-2"><legend className="px-1 text-xs">{label(section)} {i + 1}</legend>{fields.map(field => <label key={field} className={`text-sm ${/description|workSummary/.test(field) ? "sm:col-span-2" : ""}`}>{label(field)}{field.startsWith("currently") ? <input className="ml-2" type="checkbox" checked={Boolean(entry[field])} onChange={e => update(i, field, e.target.checked)}/> : /description|workSummary/.test(field) ? <Textarea rows={4} value={String(entry[field] ?? "")} onChange={e => update(i, field, e.target.value)}/> : <Input type={field === "rating" ? "number" : /Date$|^date$/.test(field) && !partialDates ? "date" : "text"} min="0" max="5" value={Array.isArray(entry[field]) ? (entry[field] as string[]).join(", ") : String(entry[field] ?? "")} onChange={e => update(i, field, field === "rating" ? Number(e.target.value) : field === "technologies" ? e.target.value.split(",").map(s => s.trim()).filter(Boolean) : e.target.value)}/>}</label>)}<Button type="button" variant="ghost" size="sm" onClick={() => onChange({ ...values, [section]: entries.filter((_, n) => n !== i) })}>Remove entry</Button></fieldset>)}<Button type="button" variant="outline" disabled={entries.length >= (section === "languages" ? 30 : 50)} onClick={() => onChange({ ...values, [section]: [...entries, {}] })}>+ Add {label(section)}</Button></div></details>;
  })}</div>;
}
