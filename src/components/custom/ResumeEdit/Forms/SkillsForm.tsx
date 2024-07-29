import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { Brain, Loader2 } from "lucide-react";
import { Skill } from "@/lib/types/resumeTypes";
import { useParams } from "next/navigation";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import toast from "react-hot-toast";
import CommonButton from "./CommonButton";

interface SkillsFormType {
  enableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const formFields: Skill = {
  name: "",
  rating: 0,
};

function SkillsForm({ enableNext }: SkillsFormType) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState<Skill[]>(
    resumeInfo?.skills?.length ? resumeInfo.skills : [{ ...formFields }]
  );
  const params = useParams<{ Id: string }>();
  const postAction = () => {
    toast.success("Resume Skills Details updated Successfully");
  };
  const {
    isError,
    isPending,
    mutate: updateSkill,
  } = useUpdateResume(postAction);

  const handleChange = <K extends keyof Skill>(
    index: number,
    name: K,
    value: Skill[K]
  ) => {
    enableNext(false);
    const newEntries = [...skillsList];
    newEntries[index] = {
      ...newEntries[index],
      [name]: value,
    };
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { ...formFields }]);
  };

  const RemoveSkill = () => {
    setSkillsList((skillList) => skillList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsList]);

  const onSave = () => {
    const data = {
      skills: skillsList.map(({ ...rest }) => rest),
    };
    updateSkill({ formData: data, id: params?.Id });
    enableNext(true);
  };

  return (
    <>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">
          <Brain /> Skills
        </h2>
        <p className="text-gray-400">Add Your top skills</p>
        <div>
          {skillsList.map((item, index) => (
            <div
              key={index}
              className="flex md:justify-between flex-col gap-3 md:flex-row border rounded-lg p-3 my-2"
            >
              <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
                <label className="text-xs font-bold">Name</label>
                <Input
                  className="w-full"
                  value={item?.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v: number) => handleChange(index, "rating", v)}
              />
            </div>
          ))}
        </div>
        <div>
          <CommonButton
            onSave={onSave}
            AddAction={AddNewSkills}
            RemoveAction={RemoveSkill}
            isError={isError}
            isPending={isPending}
            listLength={skillsList?.length}
            title="Skill"
          />
        </div>
      </div>
    </>
  );
}

export default SkillsForm;
