"use client";
import { memo, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import PersonalDetailsForm from "./Forms/PersonalDetailsForm";
import SummaryForm from "./Forms/SummaryForm";
import ExperienceForm from "./Forms/ExperienceForm";
import EducationForm from "./Forms/EducationForm";
import SkillsForm from "./Forms/SkillsForm";
import ThemeColor from "../ThemeColor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define a common props interface for all form components
interface FormComponentProps {
  enableNext: Dispatch<SetStateAction<boolean>>;
}

interface FormStep {
  id: number;
  title: string;
  Component: React.ComponentType<FormComponentProps>;
}

const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Personal Details",
    Component: PersonalDetailsForm as React.ComponentType<FormComponentProps>,
  },
  {
    id: 2,
    title: "Summary",
    Component: SummaryForm as React.ComponentType<FormComponentProps>,
  },
  {
    id: 3,
    title: "Experience",
    Component: ExperienceForm as React.ComponentType<FormComponentProps>,
  },
  {
    id: 4,
    title: "Education",
    Component: EducationForm as React.ComponentType<FormComponentProps>,
  },
  {
    id: 5,
    title: "Skills",
    Component: SkillsForm as React.ComponentType<FormComponentProps>,
  },
] as const;

const MAX_STEPS = FORM_STEPS.length;
const FINAL_STEP = MAX_STEPS + 1;

interface NavigationButtonsProps {
  activeStep: number;
  enableNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationButtons = memo(
  ({ activeStep, enableNext, onPrevious, onNext }: NavigationButtonsProps) => (
    <div className="flex gap-2">
      {activeStep > 1 && (
        <Button
          size="sm"
          onClick={onPrevious}
          aria-label="Previous step"
          className="transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <Button
        className="flex gap-2 items-center"
        size="sm"
        disabled={!enableNext}
        onClick={onNext}
        aria-label="Next step"
      >
        <span className="hidden sm:block">
          {activeStep === MAX_STEPS ? "Finish" : "Next"}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
);

NavigationButtons.displayName = "NavigationButtons";

const FormSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const params = useParams<{ Id: string }>();
  const router = useRouter();

  const handleNextClick = useCallback(() => {
    if (enableNext) {
      setActiveStep((prev) => prev + 1);
    }
  }, [enableNext]);

  const handlePreviousClick = useCallback(() => {
    setActiveStep((prev) => Math.max(1, prev - 1));
  }, []);

  useEffect(() => {
    if (activeStep === FINAL_STEP) {
      router.push(`/my-resume/${params?.Id}/view`);
    }
  }, [activeStep, params?.Id, router]);

  const CurrentStep = useMemo(() => {
    return FORM_STEPS.find((step) => step.id === activeStep);
  }, [activeStep]);

  // Destructure to get both Component and title
  const { Component: CurrentForm, title } = CurrentStep || {
    Component: null,
    title: "",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard" passHref>
                  <Button
                    aria-label="Go to dashboard"
                    className="transition-colors hover:bg-primary/90"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThemeColor />
        </div>

        <NavigationButtons
          activeStep={activeStep}
          enableNext={enableNext}
          onPrevious={handlePreviousClick}
          onNext={handleNextClick}
        />
      </div>

      <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{
            width: `${(activeStep / MAX_STEPS) * 100}%`,
          }}
          role="progressbar"
          aria-valuenow={(activeStep / MAX_STEPS) * 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="flex justify-between gap-8">
        {`${activeStep}/${MAX_STEPS}`}
        <span>{title} Form</span>
      </div>

      <div className="relative">
        {CurrentForm && <CurrentForm enableNext={setEnableNext} />}
      </div>
    </div>
  );
};

export default memo(FormSection);
