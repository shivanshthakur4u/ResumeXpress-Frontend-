"use client";
import { useContext, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/config";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
interface Version { _id: string; revision: number; source: string; createdAt: string; snapshot?: Record<string, unknown> }
export default function VersionHistory() {
  const { Id } = useParams<{Id: string}>();
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Version>();
  const client = useQueryClient(); const router = useRouter();
  const { data, isError, isFetching } = useQuery({ queryKey: ["versions", Id, page], enabled: open, queryFn: async () => (await axios.get(`resume/${Id}/versions?page=${page}`)).data as { versions: Version[]; total: number } });
  const detail = useMutation({ mutationFn: async (id: string) => (await axios.get(`resume/${Id}/versions/${id}`)).data.version as Version, onSuccess: setSelected, onError: () => toast.error("Could not load version") });
  const restore = useMutation({ mutationFn: async () => axios.post(`resume/${Id}/versions/${selected?._id}/restore`), onSuccess: () => { client.invalidateQueries({ queryKey: ["resume-by-id", Id] }); client.invalidateQueries({ queryKey: ["versions", Id] }); setSelected(undefined); toast.success("Version restored"); }, onError: () => toast.error("Could not restore version") });
  const duplicate = useMutation({ mutationFn: async () => (await axios.post(`resume/${Id}/duplicate`)).data.resume, onSuccess: resume => router.push(`/dashboard/resume/${resume._id}/edit`), onError: () => toast.error("Could not duplicate resume") });
  return <div className="rounded-xl border p-4"><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setOpen(!open); client.invalidateQueries({ queryKey: ["versions", Id] }); }}>Version history</Button><Button variant="outline" disabled={duplicate.isPending} onClick={() => duplicate.mutate()}>Duplicate resume</Button></div>
    {open && <div className="mt-4 space-y-3">{isError ? <p role="alert">Could not load history.</p> : isFetching ? <p>Loading...</p> : !data?.versions.length ? <p className="text-sm text-muted-foreground">Your first edit creates a restore point.</p> : data.versions.map(v => <button className="block w-full rounded border p-2 text-left text-sm" key={v._id} onClick={() => detail.mutate(v._id)}>Revision {v.revision} · {new Date(v.createdAt).toLocaleString()} · before {v.source} change</button>)}
      <div className="flex gap-2"><Button size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" disabled={page * 20 >= (data?.total ?? 0)} onClick={() => setPage(page + 1)}>Next</Button></div>
      {selected?.snapshot && <div className="space-y-3"><h3 className="font-semibold">Compare current with revision {selected.revision}</h3>{Object.keys({ ...resumeInfo, ...selected.snapshot }).filter(key => !["_id", "isOwner", "isPublic", "updatedAt", "createdAt"].includes(key) && JSON.stringify(resumeInfo[key]) !== JSON.stringify(selected.snapshot?.[key])).map(key => <details key={key}><summary>{!resumeInfo[key] ? "Added" : !selected.snapshot?.[key] ? "Removed" : "Modified"}: {key}</summary><p className="text-xs">Current</p><pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(resumeInfo[key], null, 2)}</pre><p className="text-xs">Restore to</p><pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(selected.snapshot?.[key], null, 2)}</pre></details>)}<p className="text-sm">Restoring replaces current content and preserves a restore point.</p><Button disabled={restore.isPending} onClick={() => restore.mutate()}>Restore this version</Button><Button variant="ghost" onClick={() => setSelected(undefined)}>Cancel</Button></div>}
    </div>}
  </div>;
}
