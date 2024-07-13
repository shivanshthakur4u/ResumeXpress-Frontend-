import React, { useState } from "react";
import PersonalDetailsForm from "./Forms/PersonalDetailsForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import SummaryForm from "./Forms/SummaryForm";
import ExperienceForm from "./Forms/ExperienceForm";


function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const handleNextClick = () => {
    if (enableNext) {
      setActiveFormIndex(activeFormIndex + 1);
    }
    console.log("current index:", activeFormIndex)
  };

  const handlePreviousClick = () => {
    if (activeFormIndex > 1) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <Button variant={"outline"} size={"sm"} className="flex gap-2">
          <LayoutGrid />
          Theme
        </Button>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button size={"sm"}
              onClick={handlePreviousClick}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            className="flex gap-2"
            size={"sm"}
            disabled={!enableNext}
            onClick={handleNextClick}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>
      {/* Personal Detail Form */}
      {
        activeFormIndex === 1 && <PersonalDetailsForm enableNext={setEnableNext} />

      }
      {
        activeFormIndex === 2 && <SummaryForm enableNext={setEnableNext} />
      }
       {
        activeFormIndex === 3 && <ExperienceForm enableNext={setEnableNext} />
      }
    </div>
  );
}

export default FormSection;
