"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";
import { Check, CloudOff, Loader2 } from "lucide-react";

import FormSection from "@/components/custom/ResumeEdit/FormSection";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import ProfileSyncActions from "@/components/custom/ResumeEdit/ProfileSyncActions";
import {
  ResumeInfoContext,
  ResumeInfoProvider,
} from "@/context/ResumeInfoContext";
import { useAutosave, type SaveStatus } from "@/lib/hooks/useAutosave";

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === "idle") return null;

  const content = {
    saving: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      text: "Saving…",
      className: "text-gray-500",
    },
    saved: {
      icon: <Check className="h-3.5 w-3.5" />,
      text: "All changes saved",
      className: "text-gray-500",
    },
    error: {
      icon: <CloudOff className="h-3.5 w-3.5" />,
      text: "Couldn't save — your last change is still on this device",
      className: "text-destructive",
    },
  }[status];

  return (
    <p
      className={`flex items-center gap-1.5 text-xs ${content.className}`}
      role="status"
      aria-live="polite"
    >
      {content.icon}
      {content.text}
    </p>
  );
};

// Must live inside ResumeInfoProvider so it can watch the resume as it is edited.
const ResumeEditor = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const params = useParams<{ Id: string }>();
  const saveStatus = useAutosave({ id: params?.Id, data: resumeInfo });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-10">
        <ProfileSyncActions resumeId={params?.Id} />
        <SaveStatusIndicator status={saveStatus} />
      </div>
      <div className="grid grid-cols-1 gap-10 p-5 md:p-10 md:pt-2 lg:grid-cols-2">
        <FormSection />
        <PreviewSection />
      </div>
    </>
  );
};

const EditResumePage = () => (
  <ResumeInfoProvider>
    <ResumeEditor />
  </ResumeInfoProvider>
);

export default EditResumePage;
