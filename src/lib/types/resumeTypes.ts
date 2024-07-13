export interface createNewResumeType {
  title: string;
  resumeid: string;
  userEmail: string;
  userName: string;
}


// Resume data type
export interface Resume {
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
interface Experience {
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  workSummary: string;
}

// Education data type
interface Education {
  id: number;
  universityName: string;
  startDate: string;
  endDate: string;
  degree: string;
  major: string;
  description: string;
}

// Skill data type
interface Skill {
  id: number;
  name: string;
  rating: number;
}
