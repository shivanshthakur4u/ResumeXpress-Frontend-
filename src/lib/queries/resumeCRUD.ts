import { axios } from "../config";

export const createNewResume = async (formData: any) => {
  const data = {
    title: formData,
  };
  return axios({
    method: "POST",
    url: "resume/createResume",
    data: data,
  });
};

export const getUserResumes = async ({page,limit}:{page:number, limit:number}) => {
  return axios({
    method: "GET",
    url: `resume/getResumes?page=${page}&limit=${limit}`,
  });
};

export const updateUserResume = async ({
  formData,
  id,
}: {
  formData: object | undefined | string;
  id: string;
}) => {
  return axios({
    method: "PUT",
    url: `resume/updateResume/${id}`,
    data: formData,
  });
};

export const getResumeById = async (id: string) => {
  return axios({
    method: "GET",
    // Express routes are case-sensitive; this previously requested
    // "getResumebyId" and every call 404'd.
    url: `resume/getResumeById/${id}`,
  });
};

export const setResumeVisibility = async ({
  id,
  isPublic,
}: {
  id: string;
  isPublic: boolean;
}) => {
  return axios({
    method: "PATCH",
    url: `resume/visibility/${id}`,
    data: { isPublic },
  });
};

export const deleteResumeById = async(id:string)=>{
  return axios({
    method:"DELETE",
    url:`resume/deleteResumeById/${id}`
  })
}