import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewResume,
  deleteResumeById,
  getResumeAuthenticity,
  getResumeById,
  getResumeMachineView,
  getUserResumes,
  setResumeVisibility,
  updateUserResume,
} from "../queries/resumeCRUD";
import type { AuthenticityResult } from "../types/authenticityTypes";
import type { MachineViewResult } from "../types/machineViewTypes";
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

// Not refetched on every keystroke: the check is cheap but the result is a
// reading exercise, so it refreshes on demand rather than flickering as you type.
export const useResumeAuthenticity = (id: string) => {
  return useQuery({
    queryKey: ["resume-authenticity", id],
    queryFn: async () => await getResumeAuthenticity(id),
    select: (data) => data?.data as AuthenticityResult,
    enabled: Boolean(id),
    staleTime: 30_000,
  });
};

export const useResumeMachineView = (id: string) => {
  return useQuery({
    queryKey: ["resume-machine-view", id],
    queryFn: async () => await getResumeMachineView(id),
    select: (data) => data?.data as MachineViewResult,
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
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
