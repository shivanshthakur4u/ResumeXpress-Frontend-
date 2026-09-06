import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewResume,
  deleteResumeById,
  getResumeById,
  getUserResumes,
  setResumeVisibility,
  updateUserResume,
} from "../queries/resumeCRUD";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useCreateNewResume = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: createNewResume,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: (data) => {

      toast.success("Your resume workspace is ready");
      router.push("/dashboard/resume/" + data?.data?._id + "/edit");
    },
  });
};

export const useGetUserResumes = ({page,limit,search="",sort="newest"}:{page:number, limit:number,search?:string,sort?:string}) => {
  return useQuery({
    queryKey: ["user-resumes", page, limit, search, sort],
    queryFn: async () => await getUserResumes({page, limit, search, sort}),
    select: (data) => data?.data,
  });
};

export const useUpdateResume = (postAction?:()=>void) => {
  return useMutation({
    mutationFn: updateUserResume,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: () => {
     if(postAction) postAction();
    },
  });
};

export const useGetResumeById = (id: string) => {
  return useQuery({
    queryKey: ["resume-by-id", id],
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    queryFn: async () => await getResumeById(id),
    select: (data) => data?.data?.resume,
  });
};

export const useSetResumeVisibility = (id: string) => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: setResumeVisibility,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: (res) => {
      queryclient.invalidateQueries({ queryKey: ["resume-by-id", id] });
      toast.success(
        res?.data?.isPublic
          ? "Anyone with the link can now view this resume"
          : "This resume is now private"
      );
    },
  });
};

export const useDeleteResumeById = () => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: deleteResumeById,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["user-resumes"] });
      toast.success("Resume Deleted Successfully");
    },
  });
};
