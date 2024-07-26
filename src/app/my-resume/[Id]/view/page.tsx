"use client";
import Header from "@/components/custom/Header";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import SharePageLoader from "@/components/custom/SharePageLoader";
import { Button } from "@/components/ui/button";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import { ResumeInfoProvider } from "@/context/ResumeInfoContext";
import { useGetResumeById } from "@/lib/queryHooks/resumeHooks";
import { FileDown, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RWebShare } from "react-web-share";

function ResumeView() {
  const params = useParams<{ Id: string }>();
  const { isError, isLoading, data } = useGetResumeById(params?.Id);
  const [resumeInfo, setResumeInfo] = useState(data);
 

  const { user } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    setResumeInfo(data);
  }, [data]);

  // console.log("data-preview:", data)

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };
  return (
    <ResumeInfoProvider>
      <div className="flex flex-col w-full">
        {isLoading && !isError ? (
          <SharePageLoader />
        ) : (
          <>
            <div
              id="no-print-area"
              className="my-10 md:mx-20 lg:mx-36 max-sm:w-full"
            >
              <h2 className="text-center text-2xl font-medium max-sm:px-4">
                {user
                  ? "Your"
                  : `${resumeInfo?.firstName} ${resumeInfo?.lastName}`}{" "}
                resume is ready for download and sharing.
              </h2>
              <p className="text-center text-gray-400 max-sm:px-4 max-sm:pt-2">
                You can now download{" "}
                {user
                  ? "your"
                  : `${resumeInfo?.firstName} ${resumeInfo?.lastName}`}{" "}
                resume and share the unique URL with potential employers and
                professional networks.
              </p>

              <div className="flex justify-between lg:px-44 px-6 my-10 items-center">
                <Button
                  disabled={isLoading}
                  id="downloadButton"
                  onClick={handleDownload}
                  className="flex gap-2"
                >
                  <FileDown size={18} />
                  Download
                </Button>

                <RWebShare
                  data={{
                    text: "Please find the link to my resume below for your review:",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-resume/${params?.Id}/view`,
                    title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}`,
                  }}
                  onClick={() => toast.success("shared successfully!")}
                >
                  <Button disabled={isLoading} className="flex gap-2">
                    Share <Share2 color="#fff" size={18} />
                  </Button>
                </RWebShare>
              </div>
            </div>

            <div
              id="print-area"
              className={
                "my-10 md:w-[60%] max-sm:w-full flex justify-center self-center"
              }
            >
              <PreviewSection />
            </div>
          </>
        )}
      </div>
    </ResumeInfoProvider>
  );
}

export default ResumeView;
