"use client";
import { useEffect } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import type { Resume } from "@/lib/types/resumeTypes";
import { axios } from "@/lib/config";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
export default function PublicResume({ resume, id, slug }: { resume: Resume; id: string; slug: string }) {
  useEffect(() => { axios.post(`resume/public/${slug}/view`).catch(() => {}); }, [slug]);
  return <div className="mx-auto max-w-4xl px-4 py-8"><div id="no-print-area" className="mb-6 flex flex-wrap gap-3"><a className="rounded border px-4 py-2 text-sm" href={`${process.env.NEXT_PUBLIC_BACKEND_URL}resume/${id}/pdf`}>Download PDF</a>{resume.email && <a className="rounded border px-4 py-2 text-sm" href={`mailto:${resume.email}`}>Contact</a>}<Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); } catch { toast.error("Copy the page URL to share this resume."); } }}>Copy share link</Button></div><div id="print-area"><ResumeInfoContext.Provider value={{ resumeInfo: resume, setResumeInfo: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }}><PreviewSection/></ResumeInfoContext.Provider></div></div>;
}
