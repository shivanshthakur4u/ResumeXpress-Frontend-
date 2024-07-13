import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useState, ChangeEvent, FormEvent} from "react";

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
  const context = useContext(ResumeInfoContext);
  const params = useParams<{ Id: string }>();



  const { mutate: updateResume, isPending, isError } = useUpdateResume();
  const [formData, setFormData] = useState<object>();
 
  if (!context) {
    return null;
  }

  const { resumeInfo, setResumeInfo } = context;



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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // console.log("resume data:", resumeInfo)
    enableNext(true);
    const data = {
      data: formData,
    };
    updateResume({
      formData: data, id: params?.Id
    });
  };



  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get Started with the basic Information</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label htmlFor="firstName" className="text-sm">
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
          <div>
            <label htmlFor="lastName" className="text-sm">
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
          <div className="col-span-2">
            <label htmlFor="jobTitle" className="text-sm">
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
          <div className="col-span-2">
            <label htmlFor="address" className="text-sm">
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
          <div>
            <label htmlFor="phone" className="text-sm">
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
          <div>
            <label htmlFor="email" className="text-sm">
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
          <Button type="submit" disabled={isPending}>{
            isPending && !isError ? <Loader2 className="animate-spin" /> : 'Save'}</Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetailsForm;
