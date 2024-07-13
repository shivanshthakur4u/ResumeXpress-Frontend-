"use client"
import NewResumeDialog from "@/components/custom/Dashboard/NewResumeDialog";
import { useGetUserResumes } from "@/lib/queryHooks/resumeHooks";
import { useUser } from "@clerk/nextjs";
import ResumeCardItems from "./ResumeCardItems";


function DashboardPage() {
  const { user } = useUser();
  const { data, isLoading, isError } = useGetUserResumes(user?.primaryEmailAddress?.emailAddress);

  //  console.log("resumes data:", data)

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating an AI Resume for Jobs</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <NewResumeDialog />
        {data?.length > 0 &&
          data?.map((resume: { attributes: any; id:number }, index: any) => (
            <ResumeCardItems resume={resume?.attributes} key={index} resumeId={resume?.id} />
          ))}
      </div>
    </div>
  );
}

export default DashboardPage;
