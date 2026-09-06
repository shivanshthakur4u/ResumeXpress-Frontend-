"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { axios } from "@/lib/config";
import type { Resume, ResumeSection } from "@/lib/types/resumeTypes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import ProfileCollections, { type Collections } from "../ProfileCollections";

type Task = "resume" | "summary" | "bullets";
interface Suggestion { field: string; index?: number; current: string; suggested: string; reason: string; confidence: number }
interface Analysis { _id: string; output: { draft?: Partial<Resume>; reasons?: Record<string, string>; evidence?: Record<string, string[]>; baseline?: Partial<Resume>; questions?: string[]; suggestions?: Suggestion[] } }
const label = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
const display = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "Empty";
  if (Array.isArray(value)) return value.map(display).join("\n\n");
  if (typeof value === "object") return Object.entries(value).filter(([key]) => !["_id", "id", "hidden", "type"].includes(key)).map(([key, item]) => `${label(key)}: ${display(item)}`).join("\n");
  return String(value);
};
const errorMessage = (error: unknown) => {
  const e = error as { message?: string; response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? e.message ?? "Something went wrong. Please try again.";
};

function DraftField({ field, value, onChange }: { field: string; value: unknown; onChange: (value: unknown) => void }) {
  if (["experience", "education", "skills"].includes(field)) return <ProfileCollections partialDates sections={[field]} values={{ [field]: value } as Collections} onChange={values => onChange(values[field])}/>;
  if (field === "sections") {
    const sections = value as NonNullable<Resume["sections"]>;
    const update = (index: number, patch: Partial<ResumeSection>) => onChange(sections.map((section, i) => i === index ? { ...section, ...patch } : section));
    return <div className="space-y-3">{sections.map((section, i) => <div className="space-y-2 rounded border p-3" key={section.id}><label className="block text-sm">Section title<Input maxLength={100} value={section.title} onChange={e => update(i, { title: e.target.value })}/></label><label className="flex items-center gap-2 text-sm"><Checkbox  checked={!section.hidden} onCheckedChange={checked => update(i, { hidden: !(checked === true) })}/>Show section</label>{section.entries ? <ProfileCollections partialDates sections={[section.type]} values={{ [section.type]: section.entries }} onChange={values => update(i, { entries: values[section.type] as NonNullable<Resume["sections"]>[number]["entries"] })}/> : section.content !== undefined && <label className="block text-sm">Content<Textarea rows={5} maxLength={20000} value={section.content} onChange={e => update(i, { content: e.target.value })}/></label>}</div>)}</div>;
  }
  return <label className="block text-sm">{label(field)}{field === "summary" ? <Textarea rows={6} maxLength={20000} value={String(value ?? "")} onChange={e => onChange(e.target.value)}/> : <Input value={String(value ?? "")} onChange={e => onChange(e.target.value)}/>}</label>;
}

export default function ResumeAI({ resume, saving, task, setTask, onApplying }: { resume: Resume; saving: boolean; task: Task; setTask: (task: Task) => void; onApplying: (value: boolean) => void }) {
  const { Id } = useParams<{ Id: string }>();
  const client = useQueryClient();
  const currentTask = useRef(task); currentTask.current = task;
  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState("professional");
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState<Analysis>();
  const [draft, setDraft] = useState<Partial<Resume>>({});
  const [generatedFrom, setGeneratedFrom] = useState("");
  useEffect(() => { setAnalysis(undefined); }, [task]);
  const [selected, setSelected] = useState<string[]>([]);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [dismissed, setDismissed] = useState<number[]>([]);
  const { data: availability, isError: statusError } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await axios.get("career/ai/status")).data as { enabled: boolean }, staleTime: 30000 });
  const generate = useMutation({ mutationFn: async () => ({ analysis: (await axios.post(`career/generate/${task}`, { resumeId: Id, message: notes, style, targetRole: targetRole || resume.targetRole || resume.jobTitle })).data.analysis as Analysis, baseline: JSON.stringify(resume), generatedTask: task }), onSuccess: ({ analysis: value, baseline, generatedTask }) => {
    if (currentTask.current !== generatedTask) return;
    setGeneratedFrom(baseline);
    setAnalysis(value); setDraft(value.output.draft ?? {}); setSelected(Object.keys(value.output.draft ?? {})); setEdits({}); setDismissed([]);
    if (process.env.NODE_ENV !== "production") console.info("[DEBUG-RESUMEXPRESS-AI]", { action: "generated", task, fields: Object.keys(value.output.draft ?? {}).length, suggestions: value.output.suggestions?.length ?? 0 });
  }, onError: error => toast.error(errorMessage(error)) });
  const apply = useMutation({ mutationFn: async (index?: number) => {
    if (!analysis) return;
    const path = index === undefined ? "apply-draft" : "apply";
    return axios.post(`career/analyses/${analysis._id}/${path}`, index === undefined ? { confirmed: true, fields: selected, edited: Object.fromEntries(selected.map(field => [field, draft[field as keyof Resume]])) } : { confirmed: true, index, edited: edits[index] ?? analysis.output.suggestions?.[index].suggested });
  }, onMutate: () => onApplying(true), onSuccess: async (_, index) => {
    if (index === undefined) setAnalysis(undefined); else setDismissed(previous => [...previous, index]);
    await Promise.all([client.invalidateQueries({ queryKey: ["resume-by-id", Id] }), client.invalidateQueries({ queryKey: ["versions", Id] }), client.invalidateQueries({ queryKey: ["workspace-overview"] })]);
    toast.success("AI draft applied and saved. You can edit it below.");
  }, onError: error => toast.error(errorMessage(error)), onSettled: () => onApplying(false) });
  const upload = useMutation({ mutationFn: async (file: File) => {
    if (file.size > 512 * 1024) throw new Error("Choose a document smaller than 512 KB.");
    if (/\.(txt|md)$/i.test(file.name)) { const text = await file.text(); if (text.length > 30000) throw new Error("Keep the text under 30,000 characters."); return text; }
    const content = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1]); reader.onerror = () => reject(new Error("Could not read the file.")); reader.readAsDataURL(file); });
    return (await axios.post("career/documents/import", { filename: file.name, content })).data.text as string;
  }, onSuccess: text => { setNotes(text); toast.success("Resume text imported. Review it, then generate your draft."); }, onError: error => toast.error(errorMessage(error)) });
  const stale = !!analysis && generatedFrom !== JSON.stringify(resume);
  const unavailable = availability?.enabled === false;
  const busy = saving || generate.isPending || apply.isPending || upload.isPending;
  const chooseTask = (next: Task) => { setTask(next); setAnalysis(undefined); };
  return <section id="resume-ai" aria-labelledby="resume-ai-title" className="scroll-mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
    <div className="flex items-start gap-3"><Sparkles className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true"/><div><h2 id="resume-ai-title" className="text-xl font-semibold">Build your resume with AI</h2><p className="mt-1 text-sm text-muted-foreground">Share rough notes or upload your existing resume. AI turns your facts into a draft you can review and use.</p></div></div>
    {unavailable && <p role="status" className="mt-4 rounded-lg border border-amber-700/40 bg-amber-950/40 p-3 text-sm text-amber-200">AI generation is currently unavailable on this server. You can prepare your notes or import your resume while it is being connected.</p>}
    {statusError && <p role="alert" className="mt-3 text-sm text-red-400">Could not check AI availability. You can still try generating.</p>}
    <div className="my-4 flex flex-wrap gap-2" aria-label="AI writing action">{([["resume", "Draft my resume"], ["summary", "Write my summary"], ["bullets", "Improve my experience"]] as const).map(([key, name]) => <Button key={key} type="button" size="sm" variant={task === key ? "default" : "outline"} disabled={busy} aria-pressed={task === key} onClick={() => chooseTask(key)}>{name}</Button>)}</div>
    <label className="block text-sm font-medium">{task === "resume" ? "Tell us about your background" : "Anything else AI should know?"}<Textarea className="mt-2 bg-card" rows={5} maxLength={30000} value={notes} disabled={generate.isPending || apply.isPending || upload.isPending} onChange={e => setNotes(e.target.value)} placeholder="Rough notes are enough: your role, work or projects, skills you used, education, and any outcomes you know. You can also use your saved career profile without retyping it."/></label>
    <div className="my-3 grid gap-3 sm:grid-cols-2"><label className="text-sm">Target role (optional)<Input className="mt-1 bg-card" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder={resume.targetRole || resume.jobTitle || "Role you are applying for"}/></label><label className="text-sm">Writing style<Select className="mt-1 block w-full rounded-md border bg-card p-2" value={style} onValueChange={value => setStyle(value)} aria-label="Writing style" options={["professional", "technical", "executive", "concise", "achievement-focused"].map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}/></label></div>
    <label className="my-3 block text-sm"><span className="flex items-center gap-2 font-medium"><Upload className="h-4 w-4"/>Or import an existing resume</span><input className="mt-2 block max-w-full text-sm" type="file" accept=".pdf,.docx,.txt,.md" disabled={busy} onChange={e => { const file = e.target.files?.[0]; if (file) upload.mutate(file); e.target.value = ""; }}/><span className="mt-1 block text-xs text-muted-foreground">PDF, Word or text, up to 512 KB. Scanned PDFs need pasted text.</span></label>
    <Button className="mt-2 gap-2" disabled={busy || unavailable || (task === "bullets" && !resume.experience?.length)} onClick={() => generate.mutate()}>{generate.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4"/>}{generate.isPending ? "Writing your draft..." : task === "resume" ? "Generate my resume" : task === "summary" ? "Generate summary" : "Generate experience bullets"}</Button>
    <p className="mt-2 text-xs text-muted-foreground">{saving ? "Waiting for your latest changes to save." : task === "bullets" && !resume.experience?.length ? "Use Draft my resume to turn your notes into your first experience entry." : "Uses this resume and your career profile. You approve changes before they are saved."}</p>
    {upload.isPending && <p role="status" className="mt-2 text-sm">Reading resume...</p>}
    {stale && <p role="status" className="mt-4 text-sm text-amber-200">Your resume changed since this draft. Generate again to use your latest changes.</p>}
    {!!analysis?.output.questions?.length && <div className="mt-5 rounded-lg border bg-card p-4"><h3 className="font-semibold">A few details would help</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm">{analysis.output.questions.map(question => <li key={question}>{question}</li>)}</ul><p className="mt-3 text-sm">Add your answers to the notes above and generate again.</p></div>}
    {analysis?.output.draft && Object.keys(analysis.output.draft).length > 0 && <div className="mt-5 space-y-3"><h3 className="font-semibold">Review your draft</h3><p className="text-sm">Choose the sections to replace. Your current content is shown alongside each proposal.</p>{Object.entries(draft).map(([field, value]) => <article key={field} className="rounded-lg border bg-card p-4"><label className="flex items-center gap-2 font-medium"><Checkbox  checked={selected.includes(field)} disabled={apply.isPending} onCheckedChange={checked => setSelected(previous => (checked === true) ? [...previous, field] : previous.filter(key => key !== field))}/>{label(field)}</label><details className="mt-2 text-sm text-muted-foreground"><summary>Current content</summary><p className="mt-2 whitespace-pre-wrap">{display(analysis.output.baseline?.[field as keyof Resume])}</p></details><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{display(value)}</p><p className="mt-3 text-sm"><strong>Why:</strong> {analysis.output.reasons?.[field] ?? "This saved draft predates per-field explanations. Review the supporting facts or generate again."}</p><details className="mt-3 text-sm"><summary>Supporting facts</summary><ul className="mt-2 list-disc pl-5">{analysis.output.evidence?.[field]?.map((quote, i) => <li key={i}>{quote}</li>)}</ul></details><details className="mt-3"><summary className="cursor-pointer text-sm font-medium">Edit proposal before applying</summary><fieldset disabled={apply.isPending} className="mt-3"><DraftField field={field} value={value} onChange={value => setDraft(previous => ({ ...previous, [field]: value }))}/></fieldset></details></article>)}<div className="flex flex-wrap gap-2"><Button disabled={busy || stale || !selected.length} onClick={() => apply.mutate(undefined)}>Confirm facts and apply selected</Button><Button variant="outline" disabled={apply.isPending} onClick={() => setAnalysis(undefined)}>Discard draft</Button></div></div>}
    {analysis?.output.suggestions?.map((suggestion, index) => dismissed.includes(index) ? null : <article className="mt-4 space-y-3 rounded-lg border bg-card p-4" key={`${analysis._id}-${index}`}><h3 className="font-semibold">{suggestion.field === "summary" ? "Suggested summary" : `Experience ${(suggestion.index ?? 0) + 1}`}</h3><details className="text-sm"><summary>Current wording</summary><p className="mt-2 whitespace-pre-wrap">{suggestion.current || "Empty"}</p></details><label className="block text-sm">Review or edit<Textarea className="mt-2" rows={5} disabled={apply.isPending} value={edits[index] ?? suggestion.suggested} onChange={e => setEdits(previous => ({ ...previous, [index]: e.target.value }))}/></label><p className="text-sm text-muted-foreground">{suggestion.reason}</p><div className="flex gap-2"><Button disabled={busy || stale || !(edits[index] ?? suggestion.suggested).trim()} onClick={() => apply.mutate(index)}>Confirm and apply</Button><Button variant="outline" disabled={apply.isPending} onClick={() => setDismissed(previous => [...previous, index])}>Reject</Button></div></article>)}
    <Link className="mt-5 inline-block text-sm font-medium text-primary underline" href={`/dashboard/career/optimizer?resume=${Id}${resume.targetJob ? `&job=${resume.targetJob}` : ""}`}>Tailor this resume to a job</Link>
  </section>;
}
