"use client";
import { useCreateNewResume } from "@/lib/queryHooks/resumeHooks";
import { Plus, Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import AddResumeDialog from "./AddResumeDialog";
function NewResumeDialog({ compact = false, quickStart = false }: { compact?: boolean; quickStart?: boolean }) {
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
      <button
        type="button"
        aria-label={compact ? "Create a resume with AI" : "Create a new resume"}
        className={compact ? "rx-button" : "new-resume-card"}
        disabled={isPending}
        onClick={() => quickStart ? createResume(`Resume ${new Date().toISOString().slice(0, 19).replace("T", " ")}`) : setShowAddPopup(true)}
      >
        {compact ? <><Sparkles className="h-4 w-4"/>{isPending ? "Opening your draft..." : quickStart ? "Start with AI" : "Create with AI"}</> : <><span className="feature-icon"><Plus size={23}/></span><strong className="mt-5 text-sm">Create a new resume</strong><span className="mt-2 max-w-[180px] text-center text-xs leading-relaxed text-muted-foreground">Start with rough notes.<br/>Let AI help tell your story.</span><span className="mt-5 flex items-center gap-2 text-xs font-medium text-primary">Start building<ArrowUpRight size={14}/></span></>}
      </button>
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
