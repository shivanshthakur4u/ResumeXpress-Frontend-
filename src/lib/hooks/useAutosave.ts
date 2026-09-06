"use client";
import { useEffect, useRef, useState } from "react";
import { updateUserResume } from "../queries/resumeCRUD";
import { useQueryClient } from "@tanstack/react-query";
export type SaveStatus = "idle" | "saving" | "saved" | "error";
const AUTOSAVE_FIELDS = [
  "title", "template", "paperSize", "typography", "fontSize", "spacing", "sections", "targetRole", "targetIndustry", "targetJob", "status",
  "firstName",
  "lastName",
  "jobTitle",
  "address",
  "phone",
  "email",
  "themeColor",
  "summary",
  "experience",
  "education",
  "skills",
] as const;


export const useAutosave = ({ id, data, serverData, paused = false, delay = 1500 }: { id?: string; data: Record<string, unknown> | undefined; serverData?: Record<string, unknown>; paused?: boolean; delay?: number }): SaveStatus => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const state = useRef({ id: "", saved: "", pending: "", running: false, failed: false });
  const client = useQueryClient();
  const acceptedServerData = useRef<Record<string, unknown>>();
  const serialized = data ? JSON.stringify(Object.fromEntries(AUTOSAVE_FIELDS.filter(key => data[key] !== undefined).map(key => [key, data[key]]))) : "";
  useEffect(() => {
    if (!id || !serialized) return;
    const current = state.current;
    if (current.id !== id) { state.current = { id, saved: serialized, pending: serialized, running: false, failed: false }; setStatus("idle"); return; }
    current.pending = serialized;
    if (current.pending !== current.saved) setStatus("saving");
  }, [id, serialized]);
  useEffect(() => {
    if (!serverData || serverData === acceptedServerData.current || state.current.running) return;
    const baseline = JSON.stringify(Object.fromEntries(AUTOSAVE_FIELDS.filter(key => serverData[key] !== undefined).map(key => [key, serverData[key]])));
    if (baseline === state.current.pending) { state.current.saved = baseline; acceptedServerData.current = serverData; setStatus("saved"); }
  }, [serverData, serialized]);
  useEffect(() => {
    const timer = setInterval(async () => {
      const current = state.current;
      if (paused || !current.id || current.running || current.saved === current.pending) return;
      const payload = current.pending;
      current.running = true;
      try {
        await updateUserResume({ id: current.id, formData: JSON.parse(payload) });
        current.saved = payload;
        current.failed = false;
        if (current === state.current) setStatus(current.pending === payload ? "saved" : "saving");
        client.invalidateQueries({ queryKey: ["versions", current.id] });
      } catch {
        current.failed = true;
        if (current === state.current) setStatus("error");
      } finally { current.running = false; }
    }, delay);
    const warn = (event: BeforeUnloadEvent) => { if (state.current.pending !== state.current.saved) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => { clearInterval(timer); window.removeEventListener("beforeunload", warn); };
  }, [delay, client, paused]);
  return status;
};
