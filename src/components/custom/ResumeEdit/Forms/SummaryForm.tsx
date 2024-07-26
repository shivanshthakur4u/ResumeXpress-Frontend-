import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { AIchatSession } from "@/lib/AIModal";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";
import { BrainCog, Loader2, NotebookPen } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import SuggestionCard from "../../SuggestionCard";
import toast from "react-hot-toast";

interface SummaryFormType {
  enableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const prompt =
  "Job Title:{jobTitle}, Depends on job title give me list of  summary for 3 experience level, Mid Level and Fresher level in 3-4 lines must be unique every time in array format, With summary and experience_level Field in JSON Format";

function SummaryForm({ enableNext }: SummaryFormType) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
  const [summary, setSummary] = useState(resumeInfo?.summary);
  const [showSuggestion, setShowSuggestion]=useState(false);
  const params = useParams<{ Id: string }>();
  const postAction = () => {
    toast.success("Resume Summary Details updated Successfully");
  };
  const {
    mutate: updateResume,
    isPending,
    isError,
  } = useUpdateResume(postAction);
  // set summary data
  useEffect(() => {
    summary &&
      setResumeInfo({
        ...resumeInfo,
        summary: summary,
      });
    //   console.log("summary:", summary);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  // handle summary change input

  const handleChange = (e: any) => {
    enableNext(false);
    setSummary(e.target.value);
  };

  // get Ai generated text summary

  const gerenerateSummaryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo.jobTitle);
    console.log("Prompt:", PROMPT);
    const result = await AIchatSession.sendMessage(PROMPT);
    console.log(JSON.parse(result.response.text()));
    setAiGenerateSummeryList(JSON.parse(result.response.text()));
   setShowSuggestion(true);
    setLoading(false);
  };

  // form submission
  const onSave = (e: FormEvent) => {
    e.preventDefault();
    enableNext(true);

    updateResume({
      formData: { summary },
      id: params?.Id,
    });
  };
  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg"><NotebookPen /> Summary</h2>
        <p>Add Summary for job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label htmlFor="summary" className="">
              Add Summary
            </label>
            <Button
              className=" border-primary text-primary flex gap-2"
              size={"sm"}
              variant={"outline"}
              type="button"
              onClick={gerenerateSummaryFromAI}
            >
              {" "}
              <BrainCog className="h-4w-4" />
              Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            // defaultValue={resumeInfo?.summary}
            onChange={handleChange}
            value={summary}
            required
          />
          <div className="mt-2 flex  justify-end">
            <Button size={"sm"} type="submit" disabled={isPending}>
              {(isPending && !isError) || loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
        {/* suggestions */}
        <div>
          {aiGeneratedSummeryList.length > 0 && showSuggestion && (
            <div className="my-5">
              <h2 className="font-bold text-lg">Suggestions</h2>
              {aiGeneratedSummeryList?.map(
                (
                  item: { summary: string; experience_level: string },
                  index
                ) => (
                  <SuggestionCard
                    key={index}
                    setSummary={setSummary}
                    item={item}
                    setShowSuggestion={setShowSuggestion}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryForm;
