import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { Education } from "@/lib/types/resumeTypes";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommonButton from "./CommonButton";

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
};

function EducationForm({ enableNext }: EducationProps) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationalList, setEducationalList] = useState<Education[]>(
    resumeInfo?.education
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

    const newEntries = educationalList.slice();
    newEntries[index][name as keyof Education] = value;
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
    const data = {
      education: educationalList.map(({ ...rest }) => rest),
    };
    updateEducation({ formData: data, id: params?.Id });
    enableNext(true);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your Educational details</p>

      <div>
        {educationalList?.map((item: Education, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {/* university Name */}
              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="universityName" className="font-bold text-xs">
                  University Name
                </label>
                <Input
                  name="universityName"
                  value={item?.universityName}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>

              {/* degree */}
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label htmlFor="degree" className="font-bold text-xs">
                  Degree
                </label>
                <Input
                  name="degree"
                  value={item?.degree}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* major */}
              <div className="max-sm:col-span-2 col-span-1  flex flex-col gap-1">
                <label htmlFor="major" className="font-bold text-xs">
                  Major
                </label>
                <Input
                  name="major"
                  value={item?.major}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* start Date */}
              <div className="max-sm:col-span-2 col-span-1  flex flex-col gap-1">
                <label htmlFor="startDate" className="font-bold text-xs">
                  Start Date
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={item?.startDate}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* end Date */}
              <div className="max-sm:col-span-2 col-span-1  flex flex-col gap-1">
                <label htmlFor="endDate" className="font-bold text-xs">
                  End Date
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={item?.endDate}
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* Description */}
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
