"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useGetResumeById } from "@/lib/queryHooks/resumeHooks";
import { useParams } from "next/navigation";
import { Check, CloudOff, Loader2, ArrowLeft, ArrowUpRight, Eye, Sparkles } from "lucide-react";

import FormSection from "@/components/custom/ResumeEdit/FormSection";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import ProfileSyncActions from "@/components/custom/ResumeEdit/ProfileSyncActions";
import {
  ResumeInfoContext,
  ResumeInfoProvider,
} from "@/context/ResumeInfoContext";
import { useAutosave, type SaveStatus } from "@/lib/hooks/useAutosave";

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === "idle") return null;

  const content = {
    saving: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      text: "Saving…",
      className: "text-muted-foreground",
    },
    saved: {
      icon: <Check className="h-3.5 w-3.5" />,
      text: "All changes saved",
      className: "text-muted-foreground",
    },
    error: {
      icon: <CloudOff className="h-3.5 w-3.5" />,
      text: "Couldn't save - keep this page open and retry",
      className: "text-destructive",
    },
  }[status];

  return (
    <p
      className={`flex items-center gap-1.5 text-xs ${content.className}`}
      role="status"
      aria-live="polite"
    >
      {content.icon}
      {content.text}
    </p>
  );
};

// Must live inside ResumeInfoProvider so it can watch the resume as it is edited.
const ResumeEditor = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const params = useParams<{ Id: string }>();
  const { isError, data: serverData } = useGetResumeById(params?.Id);
  const [aiApplying, setAiApplying] = useState(false);
  const [editorView, setEditorView] = useState<"edit" | "preview">("edit");
  const saveStatus = useAutosave({ id: params?.Id, data: resumeInfo, serverData, paused: aiApplying });

  if (isError || (resumeInfo && !resumeInfo.isOwner)) return <p role="alert" className="p-6">Could not load this resume. Check your access and try again.</p>;
  return (
    <>
      <div className="px-5 pt-7 sm:px-8"><Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"><ArrowLeft size={13}/>All resumes</Link><div className="mt-4 flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">RESUME STUDIO</p><h1 className="mt-2 text-2xl font-semibold">{resumeInfo?.title || "Your next chapter"}</h1></div><div className="flex flex-wrap items-center gap-4"><SaveStatusIndicator status={saveStatus}/>{!aiApplying && saveStatus !== "saving" && saveStatus !== "error" && <Link className="rx-button" href={`/my-resume/${params?.Id}/view`}>Preview & export<ArrowUpRight size={16}/></Link>}</div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b pb-5"><p className="max-w-md text-xs leading-6 text-muted-foreground">Share your facts, review the AI draft, then make the final edits. Your document updates as you work.</p><fieldset disabled={aiApplying || saveStatus === "saving" || saveStatus === "error"}><ProfileSyncActions resumeId={params?.Id}/></fieldset></div><div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border bg-card p-1 lg:hidden" role="group" aria-label="Editor view"><button id="edit-tab" aria-pressed={editorView === "edit"} aria-controls="editor-panel" className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm ${editorView === "edit" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`} onClick={()=>setEditorView("edit")}><Sparkles size={16}/>AI & content</button><button id="preview-tab" aria-pressed={editorView === "preview"} aria-controls="preview-panel" className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm ${editorView === "preview" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`} onClick={()=>setEditorView("preview")}><Eye size={16}/>Live preview</button></div></div>
      <div className="grid grid-cols-1 items-start gap-7 p-5 sm:p-8 lg:grid-cols-2"><div id="editor-panel" className={editorView === "edit" ? "min-w-0" : "hidden min-w-0 lg:block"}><FormSection saving={saveStatus === "saving" || saveStatus === "error"} applying={aiApplying} onApplying={setAiApplying}/></div><section id="preview-panel" aria-label="Live resume preview" className={`${editorView === "preview" ? "block" : "hidden lg:block"} min-w-0 lg:sticky lg:top-[100px]`}><div className="mb-3 flex items-center justify-between"><p className="eyebrow flex items-center gap-2"><Eye size={14}/>LIVE DOCUMENT</p><span className="status-pill text-[10px] text-muted-foreground">{resumeInfo?.paperSize || "A4"} · {resumeInfo?.template || "Original"}</span></div><div className="editor-preview"><PreviewSection/></div><p className="mt-3 text-center text-[11px] text-muted-foreground">PDF pagination is checked when you export.</p></section></div>
    </>
  );
};

const EditResumePage = () => (
  <ResumeInfoProvider>
    <ResumeEditor />
  </ResumeInfoProvider>
);

export default EditResumePage;
