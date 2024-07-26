import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { BookUser, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

interface PersonalDetailsFormType {
  enableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
}

function PersonalDetailsForm({ enableNext }: PersonalDetailsFormType) {
  const params = useParams<{ Id: string }>();
  const [formData, setFormData] = useState<object>();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const postAction = () => {
    toast.success("Resume Personal Details updated Successfully");
  };
  const {
    mutate: updateResume,
    isPending,
    isError,
  } = useUpdateResume(postAction);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    enableNext(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };
  console.log("personal form data:", formData);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // console.log("resume data:", resumeInfo)
    enableNext(true);

    updateResume({
      formData: formData,
      id: params?.Id,
    });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg"><BookUser />Personal Details</h2>
      <p>Get Started with the basic Information</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div  className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
            <label htmlFor="firstName" className="text-sm font-bold">
              First Name
            </label>
            <Input
              name="firstName"
              id="firstName"
              defaultValue={resumeInfo?.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div  className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
            <label htmlFor="lastName" className="text-sm font-bold">
              Last Name
            </label>
            <Input
              name="lastName"
              id="lastName"
              defaultValue={resumeInfo?.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label htmlFor="jobTitle" className="text-sm font-bold">
              Job Title
            </label>
            <Input
              name="jobTitle"
              id="jobTitle"
              defaultValue={resumeInfo?.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label htmlFor="address" className="text-sm font-bold">
              Address
            </label>
            <Input
              name="address"
              id="address"
              defaultValue={resumeInfo?.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-bold">
              Phone
            </label>
            <Input
              name="phone"
              id="phone"
              defaultValue={resumeInfo?.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div  className="max-sm:col-span-2 col-span-1 flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-bold">
              Email
            </label>
            <Input
              name="email"
              id="email"
              defaultValue={resumeInfo?.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && !isError ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetailsForm;
