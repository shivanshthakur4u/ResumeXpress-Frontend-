import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCareerProfile,
  importProfileToResume,
  syncProfileFromResume,
  updateCareerProfile,
} from "../queries/careerProfileQueries";

const PROFILE_KEY = ["career-profile"];

export const useCareerProfile = () =>
  useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getCareerProfile,
    select: (data) => data?.data,
  });

export const useUpdateCareerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCareerProfile,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      toast.success("Career profile saved");
    },
  });
};

export const useImportProfileToResume = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importProfileToResume,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: (res) => {
      // The editor reads the resume from this query, so it has to refetch for
      // the imported content to appear.
      queryClient.invalidateQueries({ queryKey: ["resume-by-id", resumeId] });
      toast.success(res?.data?.message ?? "Imported from your career profile");
    },
  });
};

export const useSyncProfileFromResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncProfileFromResume,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occured");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      toast.success("Career profile updated from this resume");
    },
  });
};
