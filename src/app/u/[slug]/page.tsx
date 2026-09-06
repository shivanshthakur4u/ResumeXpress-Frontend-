import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicResume from "./public-resume";
const load = async (slug: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}resume/public/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Public resume is temporarily unavailable");
  return response.json();
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Resume not found", robots: { index: false } };
  const title = `${data.resume.firstName} ${data.resume.lastName} - ${data.resume.jobTitle || "Resume"}`;
  const description = String(data.resume.summary || "Professional resume").slice(0, 160);
  return { title, description, openGraph: { title, description, type: "profile" } };
}
export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  return <PublicResume resume={data.resume} id={data.id} slug={slug}/>;
}
