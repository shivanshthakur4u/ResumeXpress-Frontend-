import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext } from "react";
import PersonalDetailsPreview from "./Preview/PersonalDetailsPreview";
import SummaryDetailsPreview from "./Preview/SummaryDetailsPreview";
import ProfessionalPreview from "./Preview/ProfessionalPreview";
import EducationalPreview from "./Preview/EducationalPreview";
import SkillsPreview from "./Preview/SkillsPreview";

function PreviewSection() {
  const context = useContext(ResumeInfoContext)
  if (!context) {
    return null;
  }

  const { resumeInfo } = context
  return (
    <div
      className={`shadow-lg h-full p-14 border-t-[20px]`}
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
