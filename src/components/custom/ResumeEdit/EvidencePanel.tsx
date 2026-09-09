"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileCheck2, Loader2, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/config";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import type { Resume } from "@/lib/types/resumeTypes";

type EvidenceItem = {
  _id: string;
  claim: { path: string; text: string };
  kind: "metric" | "link" | "document" | "reference" | "note";
  value: string;
  source: string;
  confidence: "confirmed" | "estimated" | "recalled";
  stale: boolean;
  currentText: string | null;
};
type EvidenceGroup = { path: string; evidence: EvidenceItem[] };
type EvidenceResponse = { groups: EvidenceGroup[]; total: number };

const kinds = ["metric", "link", "document", "reference", "note"] as const;
const confidences = ["confirmed", "estimated", "recalled"] as const;
const label = (value: string) => value.replace(/([A-Z])/g, " $1").replace(/[._]/g, " ").replace(/^./, letter => letter.toUpperCase());

const claimOptionsFor = (resume: Resume) => [
  ...(resume.summary ? [{ path: "summary", label: "Professional summary", text: resume.summary }] : []),
  ...(resume.experience ?? []).flatMap((entry, index) => entry.workSummary ? [{ path: `experience.${index}.workSummary`, label: `Experience ${index + 1} bullet`, text: entry.workSummary }] : []),
];

const EvidencePanel = ({ resumeId }: { resumeId: string }) => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const resume = resumeInfo as Resume | undefined;
  const options = useMemo(() => resume ? claimOptionsFor(resume) : [], [resume]);
  const [path, setPath] = useState("");
  const [claimText, setClaimText] = useState("");
  const [kind, setKind] = useState<typeof kinds[number]>("note");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("");
  const [confidence, setConfidence] = useState<typeof confidences[number]>("confirmed");
  const client = useQueryClient();
  const evidence = useQuery({
    queryKey: ["resume-evidence", resumeId],
    enabled: Boolean(resumeId),
    queryFn: async () => (await axios.get("evidence", { params: { resumeId } })).data as EvidenceResponse,
    staleTime: 30_000,
  });
  const add = useMutation({
    mutationFn: async () => (await axios.post("evidence", { resumeId, path, text: claimText.trim(), kind, value: value.trim(), source: source.trim(), confidence })).data,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["resume-evidence", resumeId] });
      setValue(""); setSource("");
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => axios.delete(`evidence/${id}`),
    onSuccess: () => client.invalidateQueries({ queryKey: ["resume-evidence", resumeId] }),
  });

  useEffect(() => {
    if (!path && options[0]) setPath(options[0].path);
  }, [path, options]);
  useEffect(() => {
    const selected = options.find(option => option.path === path);
    if (selected) setClaimText(selected.text);
  }, [path, options]);

  return (
    <section aria-labelledby="evidence-heading" className="mt-6 rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow flex items-center gap-2"><FileCheck2 size={14} /> PROOF FOR YOUR CLAIMS</p>
          <h2 id="evidence-heading" className="mt-2 text-lg font-semibold">Evidence vault</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Attach numbers, links, documents or notes so every strong line is ready to defend in an interview.</p>
        </div>
        <span className="status-pill text-[10px] text-muted-foreground">{evidence.data?.total ?? 0} attached</span>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border bg-background/40 p-4 lg:grid-cols-2">
        <label className="text-sm">Claim<Select className="mt-1 w-full" aria-label="Claim" value={path} onValueChange={setPath} options={options.length ? options.map(option => ({ value: option.path, label: option.label })) : [{ value: "", label: "Add resume content first", disabled: true }]} /></label>
        <label className="text-sm">Evidence type<Select className="mt-1 w-full" aria-label="Evidence type" value={kind} onValueChange={next => setKind(next as typeof kind)} options={kinds.map(option => ({ value: option, label: label(option) }))} /></label>
        <label className="text-sm lg:col-span-2">Claim text<Textarea rows={2} value={claimText} onChange={event => setClaimText(event.target.value)} /></label>
        <label className="text-sm">Proof value<Input value={value} onChange={event => setValue(event.target.value)} placeholder="40%, URL, document name..." /></label>
        <label className="text-sm">Confidence<Select className="mt-1 w-full" aria-label="Confidence" value={confidence} onValueChange={next => setConfidence(next as typeof confidence)} options={confidences.map(option => ({ value: option, label: label(option) }))} /></label>
        <label className="text-sm lg:col-span-2">Source or verification note<Input value={source} onChange={event => setSource(event.target.value)} placeholder="Where can you verify this?" /></label>
        <div className="lg:col-span-2"><Button disabled={add.isPending || !path || !claimText.trim() || !value.trim()} onClick={() => add.mutate()}>{add.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Attaching...</> : "Attach evidence"}</Button></div>
      </div>

      {evidence.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading your evidence...</p>}
      {evidence.isError && <p className="mt-4 text-sm text-destructive" role="alert">Could not load your evidence. Try again.</p>}
      {evidence.data?.groups.map(group => <div key={group.path} className="mt-5 rounded-lg border p-4">
        <h3 className="font-medium">{label(group.path)}</h3>
        <ul className="mt-3 space-y-3">{group.evidence.map(item => <li key={item._id} className="rounded-md bg-background/50 p-3">
          <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium">{item.value}</p><Button size="icon" variant="ghost" aria-label="Remove evidence" onClick={() => remove.mutate(item._id)} disabled={remove.isPending}><Trash2 className="h-4 w-4" /></Button></div>
          <p className="mt-1 text-xs text-muted-foreground">{label(item.kind)} · {label(item.confidence)}{item.source ? ` · ${item.source}` : ""}</p>
          {item.stale && <p className="mt-2 text-xs text-amber-500">This claim changed after the evidence was attached. Re-check the proof.</p>}
          {!item.stale && <p className="mt-2 flex items-center gap-1 text-xs text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" />Claim still matches</p>}
        </li>)}</ul>
      </div>)}
    </section>
  );
};

export default EvidencePanel;
