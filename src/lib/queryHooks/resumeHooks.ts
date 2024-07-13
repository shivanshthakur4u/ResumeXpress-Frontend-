import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewResume,
  getUserResumes,
  updateUserResume,
} from "../queries/resumeCRUD";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const useCreateNewResume = () => {
  const { toast } = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: createNewResume,
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create new resume",
        description: err?.response?.data?.message || "Some error has occured",
      });
    },
    onSuccess: (data) => {
      router.push("/dashboard/resume/" + data?.data?.data?.id + "/edit");
    },
  });
};

export const useGetUserResumes = (userEmail: string | undefined) => {
  return useQuery({
    queryKey: ["user-resumes"],
    queryFn: async () => await getUserResumes(userEmail),
    select: (data) => data?.data?.data,
  });
};

export const useUpdateResume = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateUserResume,
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to Update Details",
        description: err?.response?.data?.message || "Some error has occured",
      });
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Details Updated Successfully",
        description: "Resume Details updated Successfully",
      });
    },
  });
};
