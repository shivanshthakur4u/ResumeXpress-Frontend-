"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, Fingerprint, ScanSearch, BriefcaseBusiness, Settings2, MessageCircle, ArrowUpRight } from "lucide-react";
const links = [
  { path: "", title: "Overview", icon: LayoutDashboard }, { path: "ai", title: "AI studio", icon: Sparkles },
  { path: "career-profile", title: "Career profile", icon: Fingerprint }, { path: "career/jobs", title: "Target jobs", icon: ScanSearch },
  { path: "career/applications", title: "Applications", icon: BriefcaseBusiness }, { path: "career/coach", title: "Career copilot", icon: MessageCircle },
  { path: "settings", title: "Settings", icon: Settings2 },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="workspace-shell"><aside className="workspace-sidebar"><p className="eyebrow hidden px-3 pb-5 lg:block">YOUR CAREER, CONNECTED</p><nav aria-label="Career workspace" className="workspace-nav">{links.map(({ path, title, icon: Icon }) => { const href = `/dashboard${path ? `/${path}` : ""}`; const active = path ? pathname.startsWith(href) : pathname === href; return <Link key={path} href={href} aria-current={active ? "page" : undefined} className={`workspace-nav-item ${active ? "is-active" : ""}`}><Icon size={18}/><span>{title}</span>{active && <span className="nav-indicator"/>}</Link>; })}</nav><div className="sidebar-note"><span className="mb-3 block text-primary"><Sparkles size={21}/></span><p className="text-sm font-medium">Your facts. Better told.</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">One career profile. Every resume, letter and interview connected.</p><Link href="/dashboard/ai" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">Start with AI<ArrowUpRight size={14}/></Link></div></aside><div className="workspace-content" id="workspace-content">{children}</div></div>;
}
