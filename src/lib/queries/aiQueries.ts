import { axios } from "../config";

export interface AiSummary {
  summary: string;
  experience_level: string;
}

// These call the backend rather than the Google SDK directly. The API key stays
// on the server: anything referenced here with a NEXT_PUBLIC_ prefix would be
// inlined into the client bundle and readable by any visitor.
export const generateSummaries = async (jobTitle: string) => {
  const { data } = await axios({
    method: "POST",
    url: "ai/summaries",
    data: { jobTitle },
  });
  return data.summaries as AiSummary[];
};

export const generateExperienceBullets = async (positionTitle: string) => {
  const { data } = await axios({
    method: "POST",
    url: "ai/experience-bullets",
    data: { positionTitle },
  });
  return data.content as string;
};
