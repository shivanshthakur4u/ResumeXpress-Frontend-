import { Notebook } from "lucide-react";
import Link from "next/link";

function ResumeCardItems({ resume, resumeId }:{resume:any,  resumeId:number}) {
  // console.log("resume data:", resume)
  return (
    <Link href={"/dashboard/resume/"+resumeId+"/edit"}>
      <div className="p-14 bg-secondary flex items-center 
      justify-center h-[280px] border border-primary rounded-lg
      shadow-md hover:shadow-primary hover:scale-105 transition-all">
        <Notebook />
      </div>
      <h2 className="text-center my-1">{resume?.title}</h2>
    </Link>
  );
}


export default ResumeCardItems;
