"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { ArrowUpRight, Orbit } from "lucide-react";
import { AuthContext, type AuthContextType } from "@/context/authUserContext";
import { UserAvatar } from "./UserAvatar";
export default function Header() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const workspace = usePathname().startsWith("/dashboard");
  return <div className="site-header"><Link href={user ? "/dashboard" : "/"} className="brand" aria-label="ResumeXpress home"><span className="brand-symbol"><Orbit size={23}/></span><span>resume<span className="font-light text-muted-foreground">xpress</span><span className="brand-dot">.</span></span></Link>
    {!workspace && <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation"><Link href="/#workflow" className="hover:text-foreground">How it works</Link><Link href="/#why-resumexpress" className="hover:text-foreground">Why ResumeXpress</Link><Link href="/#questions" className="hover:text-foreground">Questions</Link></nav>}
    <div className="flex items-center gap-3">{user ? <><Link href={workspace ? "/dashboard/ai" : "/dashboard"} className="hidden text-sm font-medium text-primary sm:block">{workspace ? "Open AI studio" : "My workspace"}</Link><UserAvatar/></> : <><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link><Link href="/auth/signup" className="rx-button text-sm">Get started<ArrowUpRight size={16}/></Link></>}</div>
  </div>;
}
