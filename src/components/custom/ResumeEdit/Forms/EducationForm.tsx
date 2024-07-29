import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { Education } from "@/lib/types/resumeTypes";
import { GraduationCap, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommonButton from "./CommonButton";
import CurrentlyCheckbox from "../CurrentlyCheckbox";

interface EducationProps {
  enableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const formFields = {
  universityName: "",
  startDate: "",
  endDate: "",
  degree: "",
  major: "",
  description: "",
  currentlyStudying: false,
};

type FormFields = typeof formFields;

function EducationForm({ enableNext }: EducationProps) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [currentlyStudying, setcurrentlyStudying] = useState<boolean[]>(
    resumeInfo?.education?.map(
      (edu: Education) => edu?.currentlyStudying || false
    ) || [false]
  );
  const [educationalList, setEducationalList] = useState<Education[]>(
    resumeInfo?.education?.length ? resumeInfo?.education : [{...formFields}]
  );
  const params = useParams<{ Id: string }>();

  const postAction = () => {
    toast.success("Resume Education Details updated Successfully");
  };
  const {
    isError,
    isPending,
    mutate: updateEducation,
  } = useUpdateResume(postAction);

  const handleChnage = (e: any, index: number) => {
    enableNext(false);
    const { target } = e;
    const { name, value } = target;

    const newEntries = [...educationalList];
    newEntries[index] = {
      ...newEntries[index],
      [name as keyof FormFields]: value,
    };
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
  };

  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({ ...resumeInfo, education: educationalList });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educationalList]);

  const onSave = () => {
    const hasError = educationalList?.some((edu, index) => {
      return !currentlyStudying[index] && !edu?.endDate;
    });

    if (hasError) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedEducationList = educationalList.map((edu, index) => ({
      ...edu,
      currentlyStudying: currentlyStudying[index] || false,
      endDate: currentlyStudying[index] ? undefined : edu.endDate,
    }));
    updateEducation({ formData:{education: updatedEducationList}, id: params?.Id });
    enableNext(true);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">
        {" "}
        <GraduationCap />
        Education
      </h2>
      <p className="text-gray-400">Add Your Educational details</p>

      <div>
        {educationalList?.map((item: Education, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {Object.keys(formFields).map((field, fieldIndex) =>
                field !== "description" && field !== "currentlyStudying" ? (
                  <div
                    className={`${
                      field !== "universityName"
                        ? "max-sm:col-span-2 col-span-1"
                        : "col-span-2"
                    } flex flex-col gap-1`}
                    key={fieldIndex}
                  >
                    <label
                      htmlFor="universityName"
                      className="font-bold text-xs capitalize"
                    >
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <div className="flex flex-col gap-1">
                      <Input
                        name={field}
                        value={item[field as keyof FormFields] as string}
                        onChange={(e) => handleChnage(e, index)}
                        type={
                          field === "startDate" || field === "endDate"
                            ? "date"
                            : "text"
                        }
                        disabled={
                          field === "endDate" && currentlyStudying[index]
                        }
                      />
                      {field === "endDate" && (
                        <div>
                          <CurrentlyCheckbox
                            text="Studying"
                            checked={currentlyStudying}
                            setChecked={setcurrentlyStudying}
                            index={index}
                          />
                        </div>
                      )}
                     
                    </div>
                  </div>
                ) : null
              )}
               <div className="col-span-2  flex flex-col gap-1">
                <label htmlFor="description" className="font-bold text-xs">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={item?.description}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <CommonButton
        onSave={onSave}
        isError={isError}
        isPending={isPending}
        AddAction={AddNewEducation}
        RemoveAction={RemoveEducation}
        listLength={educationalList?.length}
        title="Education"
      />
    </div>
  );
}

export default EducationForm;
