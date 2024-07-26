import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { useParams } from "next/navigation";
import { Briefcase, Loader2 } from "lucide-react";
import { Experience } from "@/lib/types/resumeTypes";
import toast from "react-hot-toast";
import CommonButton from "./CommonButton";

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
  const [experienceList, setExperienceList] = useState<Experience[]>(
    resumeInfo?.experience
  );
  const postAction = () => {
    toast.success("Resume Experience Details updated Successfully");
  };
  const {
    isError,
    isPending,
    mutate: updateExperience,
  } = useUpdateResume(postAction);

  const params = useParams<{ Id: string }>();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    enableNext(false);
    const { name, value } = event.target;
    const newEntries = experienceList.slice();

    // name is a key of FormFields
    if (name in newEntries[index]) {
      newEntries[index][name as keyof FormFields] = value;
      setExperienceList(newEntries);
    }
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...formFields }]);
  };

  const RemoveExperience = () => {
    setExperienceList((experienceList) => experienceList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceList]);

  const handleChangeRichTextEditor = (e: any, name: string, index: number) => {
    enableNext(false);
    const newEntries = experienceList.slice();
    if (name in newEntries[index]) {
      newEntries[index][name as keyof FormFields] = e.target.value;
      setExperienceList(newEntries);
    }
  };

  const onSave = () => {
    const data = {
      experience: experienceList.map(({ ...rest }) => rest),
    };
    updateExperience({ formData: data, id: params?.Id });
    enableNext(true);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">
        <Briefcase />
        Professional Experience
      </h2>
      <p>Add previous Job Experience</p>

      <div>
        {experienceList?.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">Position Title</label>
                <Input
                  name="title"
                  value={item.title}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">Company Name</label>
                <Input
                  name="companyName"
                  value={item.companyName}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">City</label>
                <Input
                  name="city"
                  value={item.city}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">State</label>
                <Input
                  name="state"
                  value={item.state}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">End Date</label>
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
                  defvalue={item?.workSummary}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <CommonButton
        AddAction={AddNewExperience}
        RemoveAction={RemoveExperience}
        title="Experience"
        listLength={experienceList?.length}
        isError={isError}
        isPending={isPending}
        onSave={onSave}
      />
    </div>
  );
}

export default ExperienceForm;
