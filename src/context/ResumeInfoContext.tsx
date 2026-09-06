"use client";
import { useGetResumeById } from "@/lib/queryHooks/resumeHooks";
import { Resume } from "@/lib/types/resumeTypes";
import { useParams } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
interface ResumeInfoContextType {
  resumeInfo: any;
  setResumeInfo: (info: Resume) => void;
  undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean;
}
export const ResumeInfoContext = createContext<ResumeInfoContextType>({ resumeInfo: undefined, setResumeInfo: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false });
export const ResumeInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{Id: string}>();
  const { data } = useGetResumeById(params?.Id);
  const [state, setState] = useState<{ current?: Resume; past: Resume[]; future: Resume[] }>({ past: [], future: [] });
  useEffect(() => { if (data) setState({ current: data, past: [], future: [] }); }, [data]);
  const setResumeInfo = useCallback((info: Resume) => setState(s => ({ current: info, past: s.current ? [...s.past, s.current].slice(-100) : [], future: [] })), []);
  const undo = useCallback(() => setState(s => !s.past.length || !s.current ? s : ({ current: s.past[s.past.length - 1], past: s.past.slice(0, -1), future: [s.current, ...s.future] })), []);
  const redo = useCallback(() => setState(s => !s.future.length || !s.current ? s : ({ current: s.future[0], past: [...s.past, s.current], future: s.future.slice(1) })), []);
  return <ResumeInfoContext.Provider value={{ resumeInfo: state.current, setResumeInfo, undo, redo, canUndo: !!state.past.length, canRedo: !!state.future.length }}>{children}</ResumeInfoContext.Provider>;
};
