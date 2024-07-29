import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { useParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import { Experience } from "@/lib/types/resumeTypes";
import toast from "react-hot-toast";
import CommonButton from "./CommonButton";
import CurrentlyCheckbox from "../CurrentlyCheckbox";

interface ExperienceFormType {
  enableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
  currentlyWorking: false,
};

type FormFields = typeof formFields;

function ExperienceForm({ enableNext }: ExperienceFormType) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean[]>(
    resumeInfo?.experience.map(
      (exp: Experience) => exp.currentlyWorking || false
    ) || []
  );
  const [experienceList, setExperienceList] = useState<Experience[]>(
    resumeInfo?.experience?.length
      ? resumeInfo?.experience
      : [{ ...formFields }]
  );

  const {
    isError,
    isPending,
    mutate: updateExperience,
  } = useUpdateResume(() => {
    toast.success("Resume Experience Details updated successfully");
  });

  const params = useParams<{ Id: string }>();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    enableNext(false);
    const { name, value } = event.target;
    const updatedEntries = [...experienceList];

    if (name in formFields) {
      updatedEntries[index] = {
        ...updatedEntries[index],
        [name as keyof FormFields]: value,
      };
    }

    setExperienceList(updatedEntries);
  };

  const handleRichTextEditorChange = (
    value: string,
    name: string,
    index: number
  ) => {
    enableNext(false);
    const updatedEntries = [...experienceList];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [name as keyof FormFields]: value,
    };
    setExperienceList(updatedEntries);
  };

  const addNewExperience = () => {
    setExperienceList([...experienceList, { ...formFields }]);
  };

  const removeExperience = () => {
    setExperienceList(experienceList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({ ...resumeInfo, experience: experienceList });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceList]);

  const handleSave = () => {
    const hasErrors = experienceList.some((exp, index) => {
      return !currentlyWorking[index] && !exp.endDate;
    });

    if (hasErrors) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const updatedExperienceList = experienceList.map((exp, index) => ({
      ...exp,
      currentlyWorking: currentlyWorking[index] || false,
      endDate: currentlyWorking[index] ? undefined : exp.endDate,
    }));

    updateExperience({
      formData: { experience: updatedExperienceList },
      id: params?.Id,
    });
    enableNext(true);
  };

  // console.log('experience list:', experienceList)

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">
        <Briefcase />
        Professional Experience
      </h2>
      <p className="text-gray-400">Add previous job experience</p>

      {experienceList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          {Object.keys(formFields).map((field, fieldIndex) =>
            field !== "workSummary" && field !== "currentlyWorking" ? (
              <div
                key={fieldIndex}
                className={`max-sm:col-span-2 col-span-1 flex flex-col gap-1`}
              >
                <label className="text-xs font-bold capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <Input
                  name={field}
                  type={
                    field === "startDate" || field === "endDate"
                      ? "date"
                      : "text"
                  }
                  value={item[field as keyof FormFields] as string}
                  disabled={field === "endDate" && currentlyWorking[index]}
                  onChange={(event) => handleChange(event, index)}
                  required={!currentlyWorking[index]}
                />
                {field === "endDate" && (
                  <div>
                    <CurrentlyCheckbox
                      text="Working"
                      checked={currentlyWorking}
                      setChecked={setCurrentlyWorking}
                      index={index}
                    />
                  </div>
                )}
              </div>
            ) : null
          )}

          <div className="col-span-2">
            <RichTextEditor
              onRichTextEditorChange={(e) =>
                handleRichTextEditorChange(e.target.value, "workSummary", index)
              }
              label="Work Summary"
              index={index}
              defvalue={item.workSummary}
            />
          </div>
        </div>
      ))}

      <CommonButton
        AddAction={addNewExperience}
        RemoveAction={removeExperience}
        title="Experience"
        listLength={experienceList.length}
        isError={isError}
        isPending={isPending}
        onSave={handleSave}
      />
    </div>
  );
}

export default ExperienceForm;
