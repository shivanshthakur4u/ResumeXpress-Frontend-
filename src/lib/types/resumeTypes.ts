export interface createNewResumeType {
  title: string;
  resumeid: string;
  userEmail: string;
  userName: string;
}


// Resume data type
export interface Resume {
  _id?: string;
  title?: string;
  template?: string;
  paperSize?: "A4" | "Letter";
  typography?: "sans" | "serif" | "mono";
  fontSize?: number;
  spacing?: number;
  targetRole?: string;
  targetIndustry?: string;
  targetJob?: string | null;
  status?: "draft" | "ready" | "archived";
  sections?: ResumeSection[];
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

// Experience data type
export interface Experience {
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummary: string;
}

// Education data type
export interface Education {
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
  currentlyStudying:boolean;
}

// Skill data type
export interface Skill {
  name: string;
  rating: number;
}

export interface ResumeSection {
  id: string;
  type: string;
  title: string;
  hidden: boolean;
  content?: string;
  entries?: Record<string, string | string[]>[];
}
