import { axios } from "../config";
import type { ImportableSection } from "../types/careerProfileTypes";

export const getCareerProfile = async () =>
  axios({ method: "GET", url: "career-profile" });

export const updateCareerProfile = async (formData: Record<string, unknown>) =>
  axios({ method: "PUT", url: "career-profile", data: formData });

export const importProfileToResume = async ({
  resumeId,
  sections,
}: {
  resumeId: string;
  sections: ImportableSection[];
}) =>
  axios({
    method: "POST",
    url: `career-profile/import-to-resume/${resumeId}`,
    data: { sections },
  });

export const syncProfileFromResume = async (resumeId: string) =>
  axios({
    method: "POST",
    url: `career-profile/sync-from-resume/${resumeId}`,
  });
