"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import type { Resume } from "@/lib/types/resumeTypes";
import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { defaultSections, sectionNames, templates } from "@/lib/resumeLayout";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/config";
import toast from "react-hot-toast";
import { profileFields } from "../ProfileCollections";
import { Input } from "@/components/ui/input";

export default function EditorControls({ saving = false, disabled = false }: { saving?: boolean; disabled?: boolean }) {
  const { resumeInfo, setResumeInfo, undo, redo, canUndo, canRedo } = useContext(ResumeInfoContext);
  const resume = resumeInfo as Resume | undefined;
  const [dragged, setDragged] = useState<number | null>(null);
  const [jobPage, setJobPage] = useState(1);
  const [jobSearch, setJobSearch] = useState("");
  const { data: jobs, isError: jobsError, isFetching: jobsLoading } = useQuery({ queryKey: ["editor-jobs", jobPage, jobSearch], queryFn: async () => (await axios.get("career/jobs", { params: { page: jobPage, search: jobSearch } })).data as { items: { _id: string; title: string; company: string }[]; total: number } });
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (disabled || !(event.ctrlKey || event.metaKey) || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      if (key === "z" || key === "y") { event.preventDefault(); if (key === "y" || event.shiftKey) redo(); else undo(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [disabled, undo, redo]);
  const { Id } = useParams<{Id: string}>();
  const layout = useMutation({ mutationFn: async () => (await axios.get(`resume/${Id}/layout`)).data as { pages: number; warnings: string[] }, onError: () => toast.error("Could not validate layout") });
  const optimize = useMutation({ mutationFn: async () => ({ ...(await axios.post(`resume/${Id}/layout/optimize`)).data, baseline: JSON.stringify(resume) }) as { beforePages: number; pages: number; changed: boolean; settings: { fontSize: number; spacing: number }; warnings: string[]; baseline: string }, onError: () => toast.error("Could not optimize layout") });
  if (!resume) return null;
  const sections = resume.sections ?? defaultSections;
  const move = (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const next = [...sections]; next.splice(to, 0, next.splice(from, 1)[0]);
    setResumeInfo({ ...resume, sections: next });
  };
  return <details className="rounded-xl border bg-card p-4">
    <summary className="cursor-pointer font-semibold">Document settings</summary>
    <div className="my-3 flex gap-2"><Button size="sm" variant="outline" disabled={!canUndo} onClick={undo}>Undo</Button><Button size="sm" variant="outline" disabled={!canRedo} onClick={redo}>Redo</Button></div>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Title<Input value={resume.title ?? ""} onChange={e => setResumeInfo({ ...resume, title: e.target.value })}/></label>
      <label className="text-sm">Target role<Input value={resume.targetRole ?? ""} onChange={e => setResumeInfo({ ...resume, targetRole: e.target.value })}/></label>
      <label className="text-sm">Target industry<Input maxLength={200} value={resume.targetIndustry ?? ""} onChange={e => setResumeInfo({ ...resume, targetIndustry: e.target.value })}/></label>
      <label className="text-sm">Resume status<Select className="mt-1 block w-full rounded-md border p-2" value={resume.status ?? "draft"} onValueChange={value => setResumeInfo({ ...resume, status: value as Resume["status"] })} aria-label="Resume status" options={["draft", "ready", "archived"].map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}/></label>
      <div className="space-y-2 sm:col-span-2"><label className="block text-sm">Search saved jobs<Input maxLength={100} value={jobSearch} onChange={e => { setJobSearch(e.target.value); setJobPage(1); }}/></label><label className="block text-sm">Target job<Select className="mt-1 w-full rounded border p-2" value={resume.targetJob ?? ""} onValueChange={value => setResumeInfo({ ...resume, targetJob: value || null })} aria-label="Target job" options={[{ value: "", label: "No target job" }, ...(resume.targetJob && !jobs?.items.some(job => job._id === resume.targetJob) ? [{ value: resume.targetJob, label: "Saved target job (outside these results)" }] : []), ...(jobs?.items.map(job => ({ value: job._id, label: `${job.title} · ${job.company}` })) ?? [])]}/></label>{jobsError && <p role="alert" className="text-sm text-red-400">Could not load saved jobs.</p>}<div className="flex items-center gap-2"><Button size="sm" variant="ghost" disabled={jobPage === 1 || jobsLoading} onClick={() => setJobPage(page => page - 1)}>Previous jobs</Button><span className="text-xs">Page {jobPage}</span><Button size="sm" variant="ghost" disabled={jobsLoading || jobPage * 20 >= (jobs?.total ?? 0)} onClick={() => setJobPage(page => page + 1)}>Next jobs</Button></div></div>
      <label className="text-sm">Template<Select className="mt-1 block w-full rounded-md border p-2" value={resume.template ?? "legacy"} onValueChange={value => setResumeInfo({ ...resume, template: value })} aria-label="Template" options={[{ value: "legacy", label: "Original layout" }, ...templates.map(t => ({ value: t.id, label: `${t.name}${t.ats ? " (ATS-safe structure)" : ""}` }))]}/></label>
      <label className="text-sm">Paper<Select className="mt-1 block w-full rounded-md border p-2" value={resume.paperSize ?? "A4"} onValueChange={value => setResumeInfo({ ...resume, paperSize: value as "A4" | "Letter" })} aria-label="Paper" options={["A4", "Letter"].map(value => ({ value, label: value }))}/></label>
      <label className="text-sm">Typography<Select className="mt-1 block w-full rounded-md border p-2" value={resume.typography ?? "sans"} onValueChange={value => setResumeInfo({ ...resume, typography: value as "sans" | "serif" | "mono" })} aria-label="Typography" options={[{ value: "sans", label: "Sans serif" }, { value: "serif", label: "Serif" }, { value: "mono", label: "Monospace" }]}/></label>
      <label className="text-sm">Accent<Input type="color" value={/^#[a-f0-9]{6}$/i.test(resume.themeColor) ? resume.themeColor : "#243447"} onChange={e => setResumeInfo({ ...resume, themeColor: e.target.value })}/></label>
      <label className="text-sm">Text size: {resume.fontSize ?? 11} pt<input className="block w-full" type="range" min="9" max="14" step="0.5" value={resume.fontSize ?? 11} onChange={e => setResumeInfo({ ...resume, fontSize: Number(e.target.value) })}/></label>
      <label className="text-sm">Line spacing: {resume.spacing ?? 1.4}<input className="block w-full" type="range" min="1" max="1.8" step="0.05" value={resume.spacing ?? 1.4} onChange={e => setResumeInfo({ ...resume, spacing: Number(e.target.value) })}/></label>
    </div>
    <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={saving || layout.isPending} onClick={() => layout.mutate()}>Check saved PDF layout</Button><Button size="sm" variant="outline" disabled={saving || optimize.isPending} onClick={() => optimize.mutate()}>{optimize.isPending ? "Measuring layouts..." : "Optimize saved layout"}</Button></div>
    {layout.data && <div className="mt-2 text-sm" role="status"><p>{layout.data.pages} page(s)</p>{layout.data.warnings.map(warning => <p key={warning}>{warning}</p>)}</div>}
    {optimize.data && <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-3 text-sm" role="status"><p>{optimize.data.changed ? `${optimize.data.beforePages} pages → ${optimize.data.pages} pages using ${optimize.data.settings.fontSize} pt text and ${optimize.data.settings.spacing} spacing.` : "Your layout cannot use fewer pages within the readable settings checked. No changes proposed."}</p>{optimize.data.changed && <Button size="sm" disabled={saving || optimize.data.baseline !== JSON.stringify(resume)} onClick={() => { setResumeInfo({ ...resume, ...optimize.data!.settings }); optimize.reset(); }}>Apply layout</Button>}{optimize.data.baseline !== JSON.stringify(resume) && <p>Your resume changed. Measure again before applying.</p>}</div>}
    <p className="my-3 text-xs text-muted-foreground">{templates.find(t => t.id === resume.template)?.detail} Drag sections or use the arrow buttons to reorder. Outside text fields, Ctrl/Cmd+Z undoes and Ctrl/Cmd+Shift+Z redoes document changes.</p>
    <ul className="space-y-2">{sections.map((section, i) => <li key={section.id} draggable onDragStart={() => setDragged(i)} onDragOver={e => e.preventDefault()} onDrop={() => { if (dragged !== null) move(dragged, i); setDragged(null); }} className="flex flex-wrap items-center gap-2 rounded border p-2">
      <label className="flex flex-1 items-center gap-2 text-sm"><Checkbox  checked={!section.hidden} onCheckedChange={() => setResumeInfo({ ...resume, sections: sections.map((s, n) => n === i ? { ...s, hidden: !s.hidden } : s) })}/>{section.title}</label>
      <Button size="sm" variant="ghost" aria-label={`Move ${section.title} up`} disabled={!i} onClick={() => move(i, i - 1)}>↑</Button>
      <Button size="sm" variant="ghost" aria-label={`Move ${section.title} down`} disabled={i === sections.length - 1} onClick={() => move(i, i + 1)}>↓</Button>
      <Button size="sm" variant="ghost" disabled={sections.length >= 40} onClick={() => setResumeInfo({ ...resume, sections: [...sections, { ...section, id: crypto.randomUUID(), title: `${section.title} copy`, content: section.content ?? (section.type === "summary" ? resume.summary : (resume[section.type as "experience" | "education" | "skills"] ?? []).map(entry => Object.entries(entry).filter(([key]) => key !== "_id").map(([, value]) => String(value)).join("\n")).join("\n\n")) }] })}>Duplicate</Button>
      <Button size="sm" variant="ghost" onClick={() => setResumeInfo({ ...resume, sections: sections.filter(s => s.id !== section.id) })}>Remove</Button>
    </li>)}</ul>
    <label className="mt-3 block text-sm">+ Add Section<Select value="" className="mt-1 w-full rounded border p-2" disabled={sections.length >= 40} onValueChange={value => { if (value) setResumeInfo({ ...resume, sections: [...sections, { id: crypto.randomUUID(), type: value, title: sectionNames[value], hidden: false, ...(profileFields[value] && !["experience", "education", "skills"].includes(value) ? { entries: [] } : { content: "" }) }] }); }} aria-label="+ Add Section" options={[{ value: "", label: "Choose section" }, ...Object.entries(sectionNames).map(([value, label]) => ({ value, label }))]}/></label>
  </details>;
}
