"use client";
import NewResumeDialog from "@/components/custom/Dashboard/NewResumeDialog";
import { useGetUserResumes } from "@/lib/queryHooks/resumeHooks";
import ResumeCardItems from "./ResumeCardItems";
import ResumeCardLoader from "../Loaders/ResumeCardLoader";
import PaginationComponent from "./Pagination";
import { useEffect, useState } from "react";

function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isError, isLoading } = useGetUserResumes({
    page: currentPage,
    limit: 9,
  });
  // console.log("data on dashboard:", data);
 
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating an AI Resume for Jobs</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <NewResumeDialog />
        {isLoading && !isError
          ? [...Array(4)].map((_, index) => (
              <div key={index}>
                <ResumeCardLoader />
              </div>
            ))
          : !isLoading &&
            data?.resumes?.length > 0 &&
            data?.resumes?.map((resume: any) => (
              <div key={resume?._id}>
                <ResumeCardItems resume={resume} resumeId={resume?._id} />
              </div>
            ))}
      </div>
      {!isLoading && !isError && (
        <div className="pt-10">
         {totalPages >=2 &&
           <PaginationComponent
           handlePageChange={handlePageChange}
           currentPage={currentPage}
           totalPages={totalPages}
         />
         }
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
