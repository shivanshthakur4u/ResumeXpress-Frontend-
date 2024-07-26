import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React from "react";

interface AddResumeDialogTypes {
  showAddPopup: boolean;
  setShowAddPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setResumeTitle: React.Dispatch<React.SetStateAction<string>>;
  isError: boolean;
  isPending: boolean;
  onCreate:()=>void;
  resumeTitle:string,
}

function AddResumeDialog({
  showAddPopup,
  setShowAddPopup,
  setResumeTitle,
  isError,
  isPending,
  resumeTitle,
  onCreate,
}: AddResumeDialogTypes) {
  return (
    <>
      <Dialog open={showAddPopup} onOpenChange={setShowAddPopup}>
        <DialogContent className="max-sm:w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-start">Create New Resume</DialogTitle>
            <DialogDescription  className="text-start">
              <p className="pb-2">Add a title for new resume</p>
              <Input
                className="grow border-2 outline-none hover:outline-none
                  focus:outline-none focus:border-none focus-visible:ring-primary"
                placeholder="Ex.Saurabh Singh Resume"
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className="flex  justify-end gap-5 pt-2">
              <Button variant="ghost" onClick={() => setShowAddPopup(false)}>
                Cancel
              </Button>
              <Button disabled={!resumeTitle || isPending} onClick={onCreate}>
                {isPending && !isError ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResumeDialog;
