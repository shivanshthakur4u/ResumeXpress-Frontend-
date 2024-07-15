import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Education } from "@/lib/types/resumeTypes";
import React, { useContext, useEffect, useState } from "react";

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
  const [educationalList, setEducationalList] = useState<Education[]>([
    formFields,
  ]);

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleChnage = (e: any, index: number) => {
    const { target } = e;
    const { name, value } = target;

    const newEntries = educationalList.slice();
    newEntries[index][name as keyof Education] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([...educationalList, formFields]);
  };

  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({ ...resumeInfo, education: educationalList });
  }, [educationalList]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your Educational details</p>

      <div>
        {educationalList?.map((item: Education, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {/* university Name */}
              <div className="col-span-2">
                <label htmlFor="universityName">University Name</label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>

              {/* degree */}
              <div>
                <label htmlFor="degree">Degree</label>
                <Input name="degree" onChange={(e) => handleChnage(e, index)} />
              </div>
              {/* major */}
              <div>
                <label htmlFor="major">Major</label>
                <Input name="major" onChange={(e) => handleChnage(e, index)} />
              </div>
              {/* start Date */}
              <div>
                <label htmlFor="startDate">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* end Date */}
              <div>
                <label htmlFor="endDate">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  name="description"
                  onChange={(e) => handleChnage(e, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-primary"
            onClick={AddNewEducation}
          >
            + Add More Education
          </Button>
          {educationalList?.length > 1 && (
            <Button
              variant="outline"
              className="text-primary"
              onClick={RemoveEducation}
            >
              - Remove
            </Button>
          )}
        </div>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export default EducationForm;
