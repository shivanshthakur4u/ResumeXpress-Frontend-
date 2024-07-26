"use client";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext } from "react";
import PersonalDetailsPreview from "./Preview/PersonalDetailsPreview";
import SummaryDetailsPreview from "./Preview/SummaryDetailsPreview";
import ProfessionalPreview from "./Preview/ProfessionalPreview";
import EducationalPreview from "./Preview/EducationalPreview";
import SkillsPreview from "./Preview/SkillsPreview";
import { useParams, usePathname } from "next/navigation";

function PreviewSection() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const pathname = usePathname();
  const params = useParams<{ Id: string }>();
  return (
    <div
      className={` ${
        pathname !== `/my-resume/${params?.Id}/view` && 'shadow-lg'
      } h-full sm:p-14 border-t-[20px] p-5`}
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/* Personal Details */}
      <PersonalDetailsPreview resumeInfo={resumeInfo} />
      {/* Summary */}
      <SummaryDetailsPreview resumeInfo={resumeInfo} />
      {/* Professional Experience */}
      <ProfessionalPreview resumeInfo={resumeInfo} />

      {/* Educational */}
      <EducationalPreview resumeInfo={resumeInfo} />

      {/* Skills */}
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
}

export default PreviewSection;
