"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function Footer() {
  if (usePathname().startsWith("/dashboard")) return null;
  return <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t px-6 py-8 text-sm text-muted-foreground"><p>© {new Date().getFullYear()} ResumeXpress</p><p>Your experience. Clearly expressed.</p><Link href="/dashboard/ai" className="text-primary">Build your next chapter ↗</Link></div>;
}
