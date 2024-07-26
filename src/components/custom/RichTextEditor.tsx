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
  defvalue:string;
}

const PROMPT =
  "position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) must be unique every time , give me result in HTML tags only";
function RichTextEditor({
  onRichTextEditorChange,
  label,
  index,
  defvalue,
}: RichTextEditorProps) {
  const [value, setValue] = useState(defvalue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const generatWorkSummaryFromAI = async () => {
    setLoading(true);
    if (!resumeInfo?.experience[index]?.title) {
      toast({
        variant: "destructive",
        title: "Please add experience title first",
        description: "Please Add position Title to generate Summary",
      });
    }
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo?.experience[index]?.title
    );
    const result = await AIchatSession.sendMessage(prompt);

    // console.log("work summary:", result.response.text());
    const resp = result.response.text();
    setValue(resp.replace("[", "").replace("]", ""));
    setLoading(false);
  };
  return (
    <>
      <div className="flex justify-between my-2  items-end">
        <label className="text-xs font-bold">{label}</label>
        <Button
          className="flex gap-2 border-primary text-primary"
          variant={"outline"}
          size={"sm"}
          onClick={generatWorkSummaryFromAI}
        >
          {loading ? (
            <Loader2 className="animate-spin text-primary" />
          ) : (
            <>
              {" "}
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
