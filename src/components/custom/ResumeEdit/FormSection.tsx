import React, { useEffect, useState } from "react";
import PersonalDetailsForm from "./Forms/PersonalDetailsForm";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  LayoutDashboard,
  LayoutGrid,
} from "lucide-react";
import SummaryForm from "./Forms/SummaryForm";
import ExperienceForm from "./Forms/ExperienceForm";
import EducationForm from "./Forms/EducationForm";
import SkillsForm from "./Forms/SkillsForm";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ThemeColor from "../ThemeColor";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const params = useParams<{ Id: string }>();
  const router = useRouter();
  const handleNextClick = () => {
    if (enableNext) {
      setActiveFormIndex(activeFormIndex + 1);
      // setEnableNext(false)
    }
    
    // console.log("current index:", activeFormIndex)
  };

  useEffect(() => {
    if (activeFormIndex > 5 && activeFormIndex === 6) {
      router.push(`/my-resume/${params?.Id}/view`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFormIndex]);

  const handlePreviousClick = () => {
    if (activeFormIndex > 1) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Link href={"/dashboard"}>
            <Button>
              <LayoutDashboard />
            </Button>
          </Link>
          <ThemeColor />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button size={"sm"} onClick={handlePreviousClick}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="flex gap-2"
            size={"sm"}
            disabled={!enableNext}
            onClick={handleNextClick}
          >
            <span className="hidden sm:block">Next</span><ArrowRight />
          </Button>
        </div>
      </div>
      {/* Personal Detail Form */}
      {activeFormIndex === 1 ? (
        <PersonalDetailsForm enableNext={setEnableNext} />
      ) : activeFormIndex === 2 ? (
        <SummaryForm enableNext={setEnableNext} />
      ) : activeFormIndex === 3 ? (
        <ExperienceForm enableNext={setEnableNext} />
      ) : activeFormIndex === 4 ? (
        <EducationForm enableNext={setEnableNext} />
      ) : (
        activeFormIndex === 5 && <SkillsForm enableNext={setEnableNext} />
      )}
    </div>
  );
}

export default FormSection;
