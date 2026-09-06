"use client";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ScanSearch, MessageCircle, FileText, BriefcaseBusiness, Fingerprint } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/config";
import { useCareerProfile } from "@/lib/queryHooks/careerProfileHooks";
import { Input } from "@/components/ui/input";
import NewResumeDialog from "@/components/custom/Dashboard/NewResumeDialog";
import { useGetUserResumes } from "@/lib/queryHooks/resumeHooks";
import ResumeCardItems from "./ResumeCardItems";
import ResumeCardLoader from "../Loaders/ResumeCardLoader";
import PaginationComponent from "./Pagination";
import { useEffect, useState } from "react";

interface Overview {
  counts: Record<string, number>;
  activity: { _id: string; event: string; createdAt: string }[];
  resumeHealth: { id: string; title: string; completeness: number; missing: string[]; ats: { id: string; score: number; createdAt: string; stale: boolean } | null }[];
  recommendations: { analysisId: string; resumeId: string; resumeTitle: string; kind: string; field: string; reason: string }[];
}

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useQuery({ queryKey: ["workspace-overview"], queryFn: async () => (await axios.get("career/overview")).data as Overview });
  const { data: profile } = useCareerProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isError, isLoading } = useGetUserResumes({
    page: currentPage,
    limit: 9, search, sort,
  });
  // console.log("data on dashboard:", data);
 
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">YOUR NEXT CHAPTER / OVERVIEW</p><h1 className="mt-3 text-3xl font-medium sm:text-4xl">Make your next move.</h1><p className="mt-3 text-sm text-muted-foreground">Your experience is the starting point. Let’s turn it into opportunity.</p></div><NewResumeDialog compact/></div>
    <section className="dashboard-mission"><div className="max-w-xl"><span className="signal-pill"><span/>YOUR AI CAREER WORKSPACE</span><h2 className="mt-5 text-3xl font-medium leading-tight tracking-tight">Less rewriting.<br/><span className="text-primary">More ready-to-send.</span></h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Bring your notes or upload a resume. Build a clear first draft, tailor it to a job and approve the final version.</p><Link className="rx-button mt-6" href="/dashboard/ai">Open AI studio<Sparkles size={17}/></Link></div><div className="mission-steps">{[{n:'01',title:'Your facts',body:'A reusable profile of your experience',href:'/dashboard/career-profile',done:(profile?.completeness?.score??0)>=80},{n:'02',title:'Your story',body:'AI drafts. You review and approve.',href:'/dashboard/ai',done:!!data?.resumes?.length},{n:'03',title:'Your next move',body:'A tailored resume and a clear next step',href:'/dashboard/career/jobs',done:!!overview?.counts.jobs}].map(step=><Link key={step.n} href={step.href} className="mission-step"><span className={step.done?'complete':''}>{step.n}</span><div><h3 className="text-sm font-semibold">{step.title}</h3><p className="mt-1 text-xs text-muted-foreground">{step.body}</p></div><ArrowUpRight size={16} className="ml-auto text-muted-foreground"/></Link>)}</div></section>
    <div className="my-7 grid grid-cols-2 gap-3 xl:grid-cols-4">{[{title:'Career profile',value:profile?.completeness?`${profile.completeness.score}%`:'...',icon:Fingerprint,href:'/dashboard/career-profile'},{title:'Resumes',value:overview?.counts.resumes??'...',icon:FileText,href:'#my-resumes'},{title:'Target jobs',value:overview?.counts.jobs??'...',icon:ScanSearch,href:'/dashboard/career/jobs'},{title:'Applications',value:overview?.counts.applications??'...',icon:BriefcaseBusiness,href:'/dashboard/career/applications'}].map(({title,value,icon:Icon,href})=><Link key={title} href={href} className="rounded-xl border bg-card px-5 py-4 transition-colors hover:border-primary/40"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{title}</span><Icon size={16}/></div><p className="mt-3 text-2xl font-medium">{value}</p></Link>)}</div>
    <div className="mb-10 grid gap-3 md:grid-cols-3">{[{path:'optimizer',title:'Tailor for a job',text:'Make every application relevant',icon:ScanSearch},{path:'cover-letters',title:'Write the cover letter',text:'Connect your story to the role',icon:FileText},{path:'interviews',title:'Practice your interview',text:'Turn preparation into confidence',icon:MessageCircle}].map(({path,title,text,icon:Icon})=><Link key={path} href={`/dashboard/career/${path}`} className="group flex items-center gap-4 rounded-xl border p-4 hover:bg-card"><Icon size={20} className="text-primary"/><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{text}</p></div><ArrowUpRight size={15} className="ml-auto shrink-0 text-muted-foreground group-hover:text-primary"/></Link>)}</div>
    <section id="my-resumes"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">YOUR WORK, IN PROGRESS</p><h2 className="mt-2 text-xl font-semibold">My resumes</h2></div><div className="flex max-w-full flex-wrap gap-2"><Input className="max-w-[210px]" aria-label="Search resumes" placeholder="Find a resume..." value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}}/><select className="max-w-full rounded-lg border px-3 text-xs" aria-label="Sort resumes" value={sort} onChange={e=>{setSort(e.target.value);setCurrentPage(1);}}>{['newest','oldest','updated','title','status','score'].map(value=><option key={value} value={value}>{value==='score'?'Latest ATS score':value}</option>)}</select></div></div>
    {isError&&<p role="alert" className="mt-5 text-sm text-red-400">Could not load resumes. Refresh to try again.</p>}<div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"><NewResumeDialog/>{isLoading?Array.from({length:2},(_,i)=><ResumeCardLoader key={i}/>):data?.resumes?.map((resume:any)=><ResumeCardItems key={resume._id} resume={resume} resumeId={resume._id}/>)}</div>{!isLoading&&!isError&&totalPages>=2&&<div className="mt-7"><PaginationComponent handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages}/></div>}</section>
    {overviewError?<p role="alert" className="mt-8 text-sm text-red-400">Could not load your career insights.</p>:overviewLoading?<p role="status" className="mt-8 text-sm text-muted-foreground">Loading career insights...</p>:overview&&<div className="mt-10 grid gap-5 xl:grid-cols-2"><section className="rounded-xl border bg-card p-5"><div className="flex items-center gap-2"><ScanSearch size={18} className="text-primary"/><h2 className="font-semibold">Your next improvements</h2></div><p className="mt-2 text-xs text-muted-foreground">Content checks for your recently edited resumes.</p>{overview.resumeHealth.length?<ul className="mt-5 space-y-5">{overview.resumeHealth.slice(0,3).map(resume=><li key={resume.id}><div className="flex justify-between gap-3 text-sm"><Link className="truncate font-medium hover:text-primary" href={`/dashboard/resume/${resume.id}/edit`}>{resume.title}</Link><span className="text-primary">{resume.completeness}%</span></div><progress className="mt-2 h-1.5 w-full accent-primary" max={100} value={resume.completeness} aria-label={`${resume.title} content completeness`}/><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{resume.missing.length?`Next: ${resume.missing.join(', ')}`:'Your selected sections have content. Review the facts before sharing.'}</p>{resume.ats&&<Link className="mt-2 inline-block text-xs text-primary" href={`/dashboard/career/ats?analysis=${resume.ats.id}`}>Last ATS review: {resume.ats.score}%{resume.ats.stale?' · Resume changed since review':''} ↗</Link>}</li>)}</ul>:<p className="mt-5 text-sm leading-7 text-muted-foreground">Your first resume unlocks content checks and job-specific recommendations.</p>}</section><section className="rounded-xl border bg-card p-5"><div className="flex items-center gap-2"><Sparkles size={18} className="text-primary"/><h2 className="font-semibold">Ready for your review</h2></div><p className="mt-2 text-xs text-muted-foreground">AI proposals that still match your saved resume.</p>{overview.recommendations.length?<ul className="mt-5 space-y-4">{overview.recommendations.slice(0,3).map((item,i)=><li key={`${item.analysisId}-${i}`}><p className="text-sm font-medium">{item.resumeTitle}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{item.reason}</p><Link className="mt-2 inline-block text-xs font-medium text-primary" href={`/dashboard/career/${item.kind}?analysis=${item.analysisId}`}>Review change ↗</Link></li>)}</ul>:<div className="mt-5"><p className="text-sm leading-7 text-muted-foreground">Nothing waiting for approval. Add a target job to get specific suggestions for your resume.</p><Link className="mt-5 inline-flex items-center gap-2 text-sm text-primary" href="/dashboard/career/optimizer">Find my next improvement<ArrowUpRight size={15}/></Link></div>}</section></div>}
    {!!overview?.activity?.length&&<details className="mt-6 rounded-xl border p-5"><summary className="cursor-pointer text-sm text-muted-foreground">Recent activity</summary><ul className="mt-4 space-y-3">{overview.activity.map(event=><li className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground" key={event._id}><span>{event.event.replace(/_/g,' ')}</span><time>{new Date(event.createdAt).toLocaleString()}</time></li>)}</ul></details>}
  </div>;
}
export default DashboardPage;
