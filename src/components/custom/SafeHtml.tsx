"use client";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
export default function SafeHtml({ html, className }: { html: string; className?: string }) {
  const [safe, setSafe] = useState<string | null>(null);
  useEffect(() => { setSafe(DOMPurify.sanitize(html)); }, [html]);
  return safe === null ? <div className={className}>{html.replace(/<[^>]*>/g, " ")}</div> : <div className={className} dangerouslySetInnerHTML={{ __html: safe }}/>;
}
