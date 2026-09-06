"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import type { Resume } from "@/lib/types/resumeTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { defaultSections } from "@/lib/resumeLayout";
import ResumeAI from "./ResumeAI";
import { Sparkles } from "lucide-react";
import EditorControls from "./EditorControls";
import VersionHistory from "./VersionHistory";
import ProfileCollections from "../ProfileCollections";
import Editor from "react-simple-wysiwyg";

const fields: Record<string, string[]> = {
  experience: ["title", "companyName", "city", "state", "startDate", "endDate", "currentlyWorking", "workSummary"],
  education: ["universityName", "degree", "major", "startDate", "endDate", "currentlyStudying", "description"],
  skills: ["name", "rating"],
};
const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
export default function FormSection({ saving = false, applying = false, onApplying }: { saving?: boolean; applying?: boolean; onApplying: (value: boolean) => void }) {
  const context = useContext(ResumeInfoContext);
  const resume = context.resumeInfo as Resume | undefined;
  const [active, setActive] = useState("personal");
  const [aiTask, setAiTask] = useState<"resume" | "summary" | "bullets">("resume");
  const openAI = (task: "summary" | "bullets") => { setAiTask(task); document.getElementById("resume-ai")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); };
  if (!resume) return <p role="status">Loading resume...</p>;
  const sections = resume.sections ?? defaultSections;
  const section = sections.find(s => s.id === active);
  const update = (data: Partial<Resume>) => context.setResumeInfo({ ...resume, ...data });
  const arrayKey = section?.type as "experience" | "education" | "skills";
  const entries = fields[arrayKey] ? resume[arrayKey] as unknown as Record<string, string | number | boolean>[] : [];
  return <div className="min-w-0 space-y-5">
    <ResumeAI resume={resume} saving={saving} task={aiTask} setTask={setAiTask} onApplying={onApplying}/>
    <fieldset disabled={applying} className="min-w-0 space-y-5">
    <EditorControls saving={saving} disabled={applying}/>
    <nav aria-label="Resume sections" className="flex flex-wrap gap-2"><Button size="sm" variant={active === "personal" ? "default" : "outline"} onClick={() => setActive("personal")}>Personal details</Button>{sections.map(s => <Button size="sm" key={s.id} variant={active === s.id ? "default" : "outline"} onClick={() => setActive(s.id)}>{s.title}</Button>)}</nav>
    <section className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">{active === "personal" ? "Personal details" : section?.title ?? "Choose a section"}</h2>{section?.type === "summary" && section.content === undefined && <Button size="sm" variant="outline" className="gap-2" onClick={() => openAI("summary")}><Sparkles className="h-4 w-4"/>Write with AI</Button>}{section?.type === "experience" && section.content === undefined && <Button size="sm" variant="outline" className="gap-2" onClick={() => openAI("bullets")}><Sparkles className="h-4 w-4"/>Improve with AI</Button>}</div>
      {active === "personal" ? <div className="grid gap-3 sm:grid-cols-2">{(["firstName", "lastName", "jobTitle", "email", "phone", "address"] as const).map(key => <label key={key} className="text-sm">{label(key)}<Input value={resume[key]} onChange={e => update({ [key]: e.target.value })}/></label>)}</div> : section?.entries ? <ProfileCollections sections={[section.type]} values={{ [section.type]: section.entries }} onChange={values => update({ sections: sections.map(s => s.id === section.id ? { ...s, entries: values[section.type] as Record<string, string | string[]>[] } : s) })}/> : section?.type === "summary" && section.content === undefined ? <label className="block text-sm">Professional summary<Textarea rows={7} value={resume.summary} onChange={e => update({ summary: e.target.value })}/></label> : fields[arrayKey] && section?.content === undefined ? <>
        {entries.map((entry, i) => <fieldset key={i} className="space-y-3 rounded-lg border p-3"><legend className="px-1 text-sm">{section?.title} {i + 1}</legend>
          {fields[arrayKey].map(key => <label key={key} className="block text-sm">{label(key)}{key.startsWith("currently") ? <input className="ml-2" type="checkbox" checked={Boolean(entry[key])} onChange={e => update({ [arrayKey]: entries.map((item, n) => n === i ? { ...item, [key]: e.target.checked } : item) })}/> : key === "workSummary" ? <Editor value={String(entry[key] ?? "")} onChange={e => update({ [arrayKey]: entries.map((item, n) => n === i ? { ...item, [key]: e.target.value } : item) })}/> : key === "description" ? <Textarea value={String(entry[key] ?? "")} onChange={e => update({ [arrayKey]: entries.map((item, n) => n === i ? { ...item, [key]: e.target.value } : item) })}/> : <Input type={key === "rating" ? "number" : "text"} placeholder={key.endsWith("Date") ? "YYYY, YYYY-MM, or YYYY-MM-DD" : undefined} min={0} max={5} disabled={key === "endDate" && Boolean(entry.currentlyWorking || entry.currentlyStudying)} value={String(entry[key] ?? "")} onChange={e => update({ [arrayKey]: entries.map((item, n) => n === i ? { ...item, [key]: key === "rating" ? Number(e.target.value) : e.target.value } : item) })}/>}</label>)}
          <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => update({ [arrayKey]: [...entries, { ...entry }] })}>Duplicate entry</Button><Button size="sm" variant="ghost" onClick={() => update({ [arrayKey]: entries.filter((_, n) => n !== i) })}>Remove entry</Button></div>
        </fieldset>)}
        <Button variant="outline" onClick={() => update({ [arrayKey]: [...entries, Object.fromEntries(fields[arrayKey].map(key => [key, key === "rating" ? 0 : key.startsWith("currently") ? false : ""]))] })}>+ Add {section?.title}</Button>
      </> : section && <><label className="block text-sm">Section title<Input value={section.title} onChange={e => update({ sections: sections.map(s => s.id === active ? { ...s, title: e.target.value } : s) })}/></label><label className="block text-sm">Content<Textarea rows={10} value={section.content ?? ""} onChange={e => update({ sections: sections.map(s => s.id === active ? { ...s, content: e.target.value } : s) })}/></label><p className="text-xs text-muted-foreground">Include relevant names, dates, links and details. Only include information you can support.</p></>}
    </section>
    <fieldset disabled={saving}><VersionHistory/></fieldset>
    </fieldset>
  </div>;
}
