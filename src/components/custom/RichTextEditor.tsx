import React, { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { Button } from "../ui/button";
import { BrainCog, Loader2 } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { AIchatSession } from "@/lib/AIModal";
import { toast } from "../ui/use-toast";

interface RichTextEditorProps {
  onRichTextEditorChange: (e: any) => void;
  label: string;
  index: number;
  defvalue: string;
}

const PROMPT =
  "Position title: {positionTitle}. Based on this position title, provide 5-7 bullet points for my experience in resume in HTML format only. Ensure the output is wrapped in appropriate HTML tags like <ul> and <li>.";

function RichTextEditor({
  onRichTextEditorChange,
  label,
  index,
  defvalue,
}: RichTextEditorProps) {
  const [value, setValue] = useState(defvalue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  // console.log("def value rich text:", defvalue);

  const generateWorkSummaryFromAI = async () => {
    setLoading(true);
    if (!resumeInfo?.experience[index]?.title) {
      toast({
        variant: "destructive",
        title: "Please add experience title first",
        description: "Please Add position Title to generate Summary",
      });
      setLoading(false);
      return;
    }
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo?.experience[index]?.title
    );
    try {
      const result = await AIchatSession.sendMessage(prompt);
      const resp = result.response.text();

      // Ensure the response is HTML
      if (!/<[a-z][\s\S]*>/i.test(resp)) {
        // If not HTML, wrap it in HTML tags
        const formattedResp = resp
          .split("\n")
          .map((item) => `<li>${item}</li>`)
          .join("");
        setValue(`<ul>${formattedResp}</ul>`);
      } else {
        setValue(resp);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "There was an error generating the summary. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between my-2 items-end">
        <label className="text-xs font-bold">{label}</label>
        <Button
          className="flex gap-2 border-primary text-primary"
          variant={"outline"}
          size={"sm"}
          onClick={generateWorkSummaryFromAI}
        >
          {loading ? (
            <Loader2 className="animate-spin text-primary" />
          ) : (
            <>
              <BrainCog className="w-4 h-4" />
              Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <Separator />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </>
  );
}

export default RichTextEditor;
