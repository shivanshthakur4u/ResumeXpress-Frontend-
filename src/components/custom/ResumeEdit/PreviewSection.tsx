"use client";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import SafeHtml from "../SafeHtml";
import React, { useContext, type CSSProperties } from "react";
import { defaultSections } from "@/lib/resumeLayout";
import type { Resume, ResumeSection } from "@/lib/types/resumeTypes";
import PersonalDetailsPreview from "./Preview/PersonalDetailsPreview";
import SummaryDetailsPreview from "./Preview/SummaryDetailsPreview";
import ProfessionalPreview from "./Preview/ProfessionalPreview";
import EducationalPreview from "./Preview/EducationalPreview";
import SkillsPreview from "./Preview/SkillsPreview";
import { useParams, usePathname } from "next/navigation";

function PreviewSection() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const pathname = usePathname();
  const params = useParams<{ Id: string }>();
  if (!resumeInfo) return null;
  const resume = resumeInfo as Resume;
  const sections = resume.sections ?? defaultSections;
  const isLegacy = !resume.template || resume.template === "legacy";
  if (!isLegacy || resume.sections) {
    const renderSection = (section: ResumeSection) => {
      if (section.entries) return section.entries.length ? section.entries.map((entry, index) => <article key={index} className="resume-entry">
        <h3>{entry.name || entry.title || entry.organization}</h3>
        <p className="text-sm">{[entry.role, entry.issuer, entry.publisher, entry.proficiency, [entry.startDate || entry.issueDate || entry.date, entry.endDate || entry.expiryDate].filter(Boolean).join(" - ")].filter(Boolean).join(" · ")}</p>
        {entry.description && <p className="whitespace-pre-wrap">{entry.description}</p>}
        {Array.isArray(entry.technologies) && <p>{entry.technologies.join(", ")}</p>}
        {entry.credentialId && <p>Credential: {entry.credentialId}</p>}
        {typeof entry.url === "string" && /^https?:\/\//i.test(entry.url) && <a className="break-all underline" href={entry.url} target="_blank" rel="noopener noreferrer">{entry.url}</a>}
      </article>) : null;
      if (section.content !== undefined) return section.content ? <p className="whitespace-pre-wrap">{section.content}</p> : null;
      if (section.type === "summary") return resume.summary ? <p>{resume.summary}</p> : null;
      if (section.type === "skills") return resume.skills?.length ? <ul className="resume-skill-list">{resume.skills.map((s, i) => <li key={i}>{s.name}</li>)}</ul> : null;
      if (section.type === "experience") return resume.experience?.length ? resume.experience.map((e, i) => <article key={i} className="resume-entry"><h3>{e.title}</h3><div className="resume-entry-meta"><span>{[e.companyName, e.city, e.state].filter(Boolean).join(", ")}</span><span>{e.startDate}{e.startDate && " - "}{e.currentlyWorking ? "Present" : e.endDate}</span></div><SafeHtml className="rsw-ce whitespace-pre-wrap" html={e.workSummary ?? ""}/></article>) : null;
      if (section.type === "education") return resume.education?.length ? resume.education.map((e, i) => <article key={i} className="resume-entry"><h3>{e.universityName}</h3><div className="resume-entry-meta"><span>{[e.degree, e.major].filter(Boolean).join(", ")}</span><span>{e.startDate}{e.startDate && " - "}{e.currentlyStudying ? "Present" : e.endDate}</span></div><p>{e.description}</p></article>) : null;
      return section.content ? <p className="whitespace-pre-wrap">{section.content}</p> : null;
    };
    return <><style>{`@page { size: ${resume.paperSize === "Letter" ? "Letter" : "A4"}; margin: 12mm; }`}</style><div className={`resume-document template-${resume.template ?? "professional"}`} style={{ "--resume-accent": resume.themeColor || "#243447", "--resume-size": `${resume.fontSize ?? 11}pt`, "--resume-leading": resume.spacing ?? 1.4, fontFamily: resume.typography === "serif" ? "Georgia, serif" : resume.typography === "mono" ? "monospace" : "Arial, sans-serif" } as CSSProperties}>
      <header className="resume-identity"><h1>{resume.firstName} {resume.lastName}</h1><p className="resume-role">{resume.jobTitle}</p><p className="resume-contact">{resume.address}{resume.address && " · "}<a href={`mailto:${resume.email}`}>{resume.email}</a>{resume.phone && " · "}<a href={`tel:${resume.phone}`}>{resume.phone}</a></p></header>
      {sections.filter(s => !s.hidden).map(section => { const body = renderSection(section); return body ? <section className="resume-section" key={section.id}><h2>{section.title}</h2><div className="resume-section-body">{body}</div></section> : null; })}
    </div></>;
  }
  return (
    <div
      className={` ${
        pathname !== `/my-resume/${params?.Id}/view` && 'shadow-lg'
      } resume-paper h-full sm:p-14 border-t-[20px] p-5`}
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/* Personal Details */}
      <PersonalDetailsPreview resumeInfo={resumeInfo} />
      {/* Summary */}
      <SummaryDetailsPreview resumeInfo={resumeInfo} />
      {/* Professional Experience */}
      <ProfessionalPreview resumeInfo={resumeInfo} />

      {/* Educational */}
      <EducationalPreview resumeInfo={resumeInfo} />

      {/* Skills */}
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
}

export default PreviewSection;
