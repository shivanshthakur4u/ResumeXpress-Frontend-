"use client"
import dummy from "@/data/dummy";
import { useGetResumeById } from "@/lib/queryHooks/resumeHooks";
import { Resume } from "@/lib/types/resumeTypes";
import { useParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface ResumeInfoContextType {
    resumeInfo: any;
    setResumeInfo: (info: Resume) => void;
}

// default value for the context
const defaultValue: ResumeInfoContextType = {
    resumeInfo: dummy,
    setResumeInfo: () => {},
};

export const ResumeInfoContext = createContext<ResumeInfoContextType>(defaultValue);

export const ResumeInfoProvider = ({ children }: { children: React.ReactNode }) => {
    const params = useParams<{Id:string}>();
    const {data}=useGetResumeById(params?.Id)

    //  console.log("data-data:", data)
    const [resumeInfo, setResumeInfo] = useState<Resume>(data);

    useEffect(()=>{
        setResumeInfo(data)
    },[data])
   
    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            {children}
        </ResumeInfoContext.Provider>
    );
};
