"use client";
import { useCreateNewResume } from "@/lib/queryHooks/resumeHooks";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import AddResumeDialog from "./AddResumeDialog";
function NewResumeDialog() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const {
    mutate: createResume,
    isError,
    isPending,
  } = useCreateNewResume();
  //   console.log("data received:", data?.data?.data?.attributes);
  const onCreate = () => {
   
    createResume(resumeTitle);
  };
  return (
    <>
      <div
        className="p-14 py-24 items-center border 
      flex justify-center bg-secondary
       rounded-lg h-[280px] 
       hover:scale-105 transition-all
        hover:shadow-md cursor-pointer border-dashed"
        onClick={() => setShowAddPopup(true)}
      >
        <PlusSquare />
      </div>
      <AddResumeDialog
        setShowAddPopup={setShowAddPopup}
        showAddPopup={showAddPopup}
        setResumeTitle={setResumeTitle}
        isError={isError}
        isPending={isPending}
        onCreate={onCreate}
        resumeTitle={resumeTitle}
      />
    </>
  );
}

export default NewResumeDialog;
