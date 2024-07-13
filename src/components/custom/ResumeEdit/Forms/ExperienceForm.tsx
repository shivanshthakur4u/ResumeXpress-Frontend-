import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

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
};

type FormFields = typeof formFields;

function ExperienceForm({ enableNext }: ExperienceFormType) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experienceList, setExperienceList] = useState<FormFields[]>([
    formFields,
  ]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    const newEntries = experienceList.slice();

    // name is a key of FormFields
    if (name in newEntries[index]) {
      newEntries[index][name as keyof FormFields] = value;
      setExperienceList(newEntries);
    }
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, formFields]);
  };

  const RemoveExperience = () => {
    setExperienceList((experienceList) => experienceList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList,
    });
  }, [experienceList]);

  const handleChangeRichTextEditor = (e: any, name: string, index: number) => {
    const newEntries = experienceList.slice();
    if (name in newEntries[index]) {
      newEntries[index][name as keyof FormFields] = e.target.value;
      setExperienceList(newEntries);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add previous Job Experience</p>

      <div>
        {experienceList?.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Position Title</label>
                <Input
                  name="title"
                  value={item.title}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div>
                <label className="text-xs">Company Name</label>
                <Input
                  name="companyName"
                  value={item.companyName}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div>
                <label className="text-xs">City</label>
                <Input
                  name="city"
                  value={item.city}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div>
                <label className="text-xs">State</label>
                <Input
                  name="state"
                  value={item.state}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div>
                <label className="text-xs">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div>
                <label className="text-xs">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="col-span-2">
                <RichTextEditor
                  onRichTextEditorChange={(e) =>
                    handleChangeRichTextEditor(e, "workSummary", index)
                  }
                  label={"Work Summary"}
                  index={index}
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
            onClick={AddNewExperience}
          >
            + Add More Experience
          </Button>
          {experienceList?.length > 1 && (
            <Button
              variant="outline"
              className="text-primary"
              onClick={RemoveExperience}
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

export default ExperienceForm;
