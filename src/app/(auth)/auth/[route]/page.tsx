"use client";
import { Orbit, Fingerprint, Layers, FileCheck2 } from "lucide-react";
import AuthFormComponents from "@/components/custom/AuthFormComponents";
import { useParams, useSearchParams } from "next/navigation";
import NotFound from "@/app/not-found";
import ForgotPassword from "@/components/custom/Auth/ForgotPassword";
import ResetPassword from "@/components/custom/Auth/ResetPassword";
export default function AuthPage() {
  const { route } = useParams<{ route: string }>(); const searchParams = useSearchParams();
  if (!["login", "signup", "forgot-password", "reset-password"].includes(route)) return <NotFound/>;
  if (route === "forgot-password") return <ForgotPassword/>;
  if (route === "reset-password") return searchParams.get("token") ? <ResetPassword token={searchParams.get("token")!}/> : <NotFound/>;
  const isSignin = route === "login";
  return <div className="mx-auto grid min-h-[calc(100dvh-160px)] max-w-6xl items-center gap-16 px-6 py-14 lg:grid-cols-2"><section className="hidden lg:block"><span className="feature-icon mb-8"><Orbit size={25}/></span><p className="eyebrow">YOUR CAREER, CLEARLY EXPRESSED</p><h1 className="section-title">The next chapter<br/>starts with <span className="text-primary">you.</span></h1><p className="mt-6 max-w-sm text-muted-foreground leading-7">A place for your experience to become a focused, confident application.</p><div className="mt-10 space-y-6">{[{icon:Fingerprint,text:"Your career facts, ready to reuse"},{icon:Layers,text:"AI changes you review and control"},{icon:FileCheck2,text:"Polished documents, ready to send"}].map(({icon:Icon,text})=><p key={text} className="flex items-center gap-3 text-sm text-muted-foreground"><Icon className="text-primary" size={18}/>{text}</p>)}</div></section><section className="mx-auto w-full max-w-md rounded-2xl border bg-card p-7 shadow-2xl sm:p-9 animate-enter"><p className="eyebrow">{isSignin ? "PICK UP WHERE YOU LEFT OFF" : "MAKE YOUR NEXT MOVE"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{isSignin ? "Welcome back." : "Create your workspace."}</h2><p className="mb-8 mt-3 text-sm text-muted-foreground">{isSignin ? "Your resumes, ideas and opportunities are waiting." : "Start with your experience. Let AI help with the writing."}</p><AuthFormComponents isSignin={isSignin}/></section></div>;
}
