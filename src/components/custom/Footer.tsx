"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
export default function Footer() {
  if (usePathname().startsWith("/dashboard")) return null;
  return <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t px-6 py-8 text-sm text-muted-foreground"><p>© {new Date().getFullYear()} ResumeXpress</p><p className="flex items-center gap-2">Made with <Heart size={14} className="fill-primary/20 text-primary" aria-label="love"/> by <a href="https://portfolio-webapp-ochre.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary">Saurabh Singh</a></p><Link href="/dashboard/ai" className="text-primary">Build your next chapter ↗</Link></div>;
}
