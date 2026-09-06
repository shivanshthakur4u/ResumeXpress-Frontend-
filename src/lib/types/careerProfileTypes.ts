import type { Education, Experience, Skill } from "./resumeTypes";

export interface CareerPreferences {
  targetRoles?: string[];
  targetIndustries?: string[];
  employmentTypes?: string[];
  locations?: string[];
  remotePreference?: string;
  salaryExpectation?: string;
  noticePeriod?: string;
}

export interface CareerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: unknown[];
  certifications: unknown[];
  awards: unknown[];
  publications: unknown[];
  preferences?: CareerPreferences;
}

export interface CompletenessSection {
  key: string;
  label: string;
  weight: number;
  complete: boolean;
}

export interface Completeness {
  score: number;
  sections: CompletenessSection[];
  missing: string[];
}

// Sections a resume can currently render. Profile-only sections such as
// projects are excluded until the resume editor supports them.
export type ImportableSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills";
