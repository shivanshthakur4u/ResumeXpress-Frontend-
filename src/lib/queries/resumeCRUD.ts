import { FormData } from "@/components/custom/ResumeEdit/Forms/PersonalDetailsForm";
import { axios } from "../config";

export const createNewResume = async (formData: any) => {
  const data = {
    data: formData,
  };
  return axios({
    method: "POST",
    url: "/user-resumes",
    data: data,
  });
};

export const getUserResumes = async (userEmail: string | undefined) => {
  return axios({
    method: "GET",
    url: "/user-resumes?filters[userEmail][$eq]=" + userEmail,
  });
};

export const updateUserResume = async ({
  formData,
  id,
}: {
  formData: object | undefined;
  id: string;
}) => {
  
  return axios({
    method: "PUT",
    url: `/user-resumes/${id}`,
    data: formData,
  });
};
