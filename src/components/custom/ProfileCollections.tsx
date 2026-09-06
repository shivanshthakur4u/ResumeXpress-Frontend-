"use client";
import { BriefcaseBusiness, GraduationCap, Wrench, FolderKanban, BadgeCheck, Trophy, BookOpen, HeartHandshake, Languages, Plus, Trash2 } from "lucide-react";
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
const sectionIcons: Record<string, typeof BriefcaseBusiness> = { experience: BriefcaseBusiness, education: GraduationCap, skills: Wrench, projects: FolderKanban, certifications: BadgeCheck, achievements: Trophy, awards: Trophy, publications: BookOpen, volunteer: HeartHandshake, languages: Languages };
const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
type Entry = Record<string, string | number | boolean | string[]>;
export type Collections = Record<string, Entry[]>;
export default function ProfileCollections({ values, onChange, sections, partialDates = false }: { partialDates?: boolean; values: Collections; onChange: (values: Collections) => void; sections?: string[] }) {
  return <div className="space-y-3">{Object.entries(profileFields).filter(([section]) => !sections || sections.includes(section)).map(([section, fields]) => {
    const entries = values[section] ?? [];
    const Icon = sectionIcons[section];
    const update = (i: number, field: string, value: Entry[string] | undefined) => onChange({ ...values, [section]: entries.map((entry, n) => {
      if (n !== i) return entry;
      const next = { ...entry };
      if (value === undefined) delete next[field]; else next[field] = value;
      return next;
    }) });
    return <details key={section} open={!!sections} className="profile-collection overflow-hidden rounded-xl border bg-card transition-colors open:border-primary/25" onToggle={event => { if (process.env.NODE_ENV === "development") console.debug("[DEBUG-RESUMEXPRESS-UI]", { control: "profile-section", section, open: event.currentTarget.open }); }}><summary><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon size={17} aria-hidden="true"/></span><span className="min-w-0 flex-1 text-sm font-medium">{label(section)}</span><span className="rounded-md bg-muted px-2 py-1 text-[11px] font-normal text-muted-foreground">{entries.length ? `${entries.length} added` : "Not added"}</span></summary><div className="space-y-4 p-4">{!entries.length && <p className="text-sm leading-6 text-muted-foreground">Add your {label(section).toLowerCase()} once. Use these facts in your resumes and AI drafts.</p>}{entries.map((entry, i) => <fieldset key={i} className="grid min-w-0 gap-4 rounded-xl border bg-background/40 p-4 sm:grid-cols-2"><legend className="px-2 text-xs font-medium text-muted-foreground">{label(section)} {i + 1}</legend>{fields.map(field => <label key={field} className={`text-sm ${/description|workSummary/.test(field) ? "sm:col-span-2" : ""}`}>{label(field)}{field.startsWith("currently") ? <input className="ml-2" type="checkbox" checked={Boolean(entry[field])} onChange={e => update(i, field, e.target.checked)}/> : /description|workSummary/.test(field) ? <Textarea rows={4} value={String(entry[field] ?? "")} onChange={e => update(i, field, e.target.value)}/> : <Input type={field === "rating" ? "number" : /Date$|^date$/.test(field) && !partialDates ? "date" : "text"} onBlur={field === "technologies" ? e => update(i, field, e.target.value.split(",").map(s => s.trim()).filter(Boolean)) : undefined} min={field === "rating" ? 0 : undefined} max={field === "rating" ? 5 : undefined} value={Array.isArray(entry[field]) ? (entry[field] as string[]).join(", ") : String(entry[field] ?? "")} onChange={e => update(i, field, field === "rating" ? (e.target.value === "" ? undefined : Number(e.target.value)) : field === "technologies" ? e.target.value.split(",").map(s => s.trim()) : e.target.value)}/>}</label>)}<Button type="button" variant="ghost" size="sm" onClick={() => onChange({ ...values, [section]: entries.filter((_, n) => n !== i) })} className="justify-self-start text-muted-foreground hover:text-red-300"><Trash2 size={14} className="mr-2"/>Remove entry</Button></fieldset>)}<Button type="button" variant="outline" disabled={entries.length >= (section === "languages" ? 30 : 50)} onClick={() => onChange({ ...values, [section]: [...entries, {}] })} className="gap-2 border-primary/25 bg-primary/5 text-primary hover:bg-primary/10"><Plus size={15}/>Add {label(section)}</Button></div></details>;
  })}</div>;
}
