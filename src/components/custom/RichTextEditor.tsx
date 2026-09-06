"use client";
import { memo, useCallback, useContext, useState, useEffect } from "react";
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
  type ContentEditableEvent,
} from "react-simple-wysiwyg";
import { Button } from "../ui/button";
import { BrainCog, Loader2 } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { generateExperienceBullets } from "@/lib/queries/aiQueries";
import { toast } from "../ui/use-toast";

interface RichTextEditorProps {
  onRichTextEditorChange: (e: any) => void;
  label: string;
  index: number;
  defvalue: string;
}

const EditorToolbar = memo(() => (
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
));

EditorToolbar.displayName = 'EditorToolbar';

const RichTextEditor = memo(({
  onRichTextEditorChange,
  label,
  index,
  defvalue,
}: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(defvalue);
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    setEditorValue(defvalue);
  }, [defvalue]);

  const handleEditorChange = useCallback((e: ContentEditableEvent) => {
    const newValue = e.target.value;
    setEditorValue(newValue);
    onRichTextEditorChange(newValue);
  }, [onRichTextEditorChange]);

  const generateWorkSummary = useCallback(async () => {
    const experienceTitle = resumeInfo?.experience[index]?.title;

    if (!experienceTitle?.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Position Title",
        description: "Please add a position title before generating the summary.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Returns HTML that the server has already normalised and sanitised,
      // since this value is rendered as markup in the resume preview.
      const content = await generateExperienceBullets(experienceTitle);

      setEditorValue(content);
      onRichTextEditorChange(content);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          error?.response?.data?.message ??
          "Failed to generate summary. Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [resumeInfo?.experience, index, onRichTextEditorChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label 
          className="text-xs font-bold"
          htmlFor={`editor-${index}`}
        >
          {label}
        </label>
        <Button
          className="flex gap-2 border-primary text-primary"
          variant="outline"
          size="sm"
          onClick={generateWorkSummary}
          disabled={isGenerating}
          aria-label="Generate content using AI"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin text-primary h-4 w-4" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <BrainCog className="h-4 w-4" />
              <span>Generate from AI</span>
            </>
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          id={`editor-${index}`}
          value={editorValue}
          onChange={handleEditorChange}
          aria-label={`Rich text editor for ${label}`}
        >
          <EditorToolbar />
        </Editor>
      </EditorProvider>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;