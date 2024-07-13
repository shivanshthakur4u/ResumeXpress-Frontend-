"use client"
import dummy from "@/data/dummy";
import { Resume } from "@/lib/types/resumeTypes";
import { createContext, useState } from "react";

interface ResumeInfoContextType {
    resumeInfo: Resume;
    setResumeInfo: (info: Resume) => void;
}

// default value for the context
const defaultValue: ResumeInfoContextType = {
    resumeInfo: dummy,
    setResumeInfo: () => {},
};

export const ResumeInfoContext = createContext<ResumeInfoContextType>(defaultValue);

export const ResumeInfoProvider = ({ children }: { children: React.ReactNode }) => {
    const [resumeInfo, setResumeInfo] = useState<Resume>(dummy);
    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            {children}
        </ResumeInfoContext.Provider>
    );
};
