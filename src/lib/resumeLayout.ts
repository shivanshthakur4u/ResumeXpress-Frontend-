import type { ResumeSection } from "./types/resumeTypes";
export const templates = [
  { id: "ats-minimal", name: "ATS Minimal", detail: "Single column, text skills, clear headings", ats: true },
  { id: "professional", name: "Professional", detail: "Left aligned headings with ruled sections", ats: true },
  { id: "modern", name: "Modern", detail: "Offset identity block and section labels", ats: false },
  { id: "executive", name: "Executive", detail: "Prominent identity and serif editorial hierarchy", ats: true },
  { id: "technical", name: "Technical", detail: "Compact technical hierarchy and monospace headings", ats: true },
  { id: "academic", name: "Academic", detail: "Formal CV hierarchy with numbered sections", ats: true },
];
export const sectionNames: Record<string, string> = {
  summary: "Professional Summary", experience: "Experience", education: "Education", skills: "Skills",
  projects: "Projects", certifications: "Certifications", awards: "Awards", publications: "Publications",
  volunteer: "Volunteer Experience", languages: "Languages", interests: "Interests", leadership: "Leadership",
  coursework: "Coursework", research: "Research", achievements: "Achievements",
};
export const defaultSections: ResumeSection[] = ["summary", "experience", "education", "skills"].map(type => ({ id: type, type, title: sectionNames[type], hidden: false }));
