"use client"

import FormSection from "@/components/custom/ResumeEdit/FormSection";
import PreviewSection from "@/components/custom/ResumeEdit/PreviewSection";
import { ResumeInfoProvider } from "@/context/ResumeInfoContext";

const EditResumePage = () => {
 

  return (
    <ResumeInfoProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:p-10 p-5 gap-10">
        {/* form section */}
        <FormSection />

        {/* resume Preview */}
        <PreviewSection />
      </div>
    </ResumeInfoProvider>
  );
};

export default EditResumePage;
