import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteResumeById } from "@/lib/queryHooks/resumeHooks";
import { Loader2 } from "lucide-react";
import React from "react";

interface DeleteResumePopupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resumeId: string;
}

function DeleteResumePopup({
  open,
  setOpen,
  resumeId,
}: DeleteResumePopupProps) {
  const { mutate: deletResume, isError, isPending } = useDeleteResumeById();

  const handleDeleteResume = () => {
    // console.log("Deleting resume with ID:", resumeId);
    deletResume(resumeId);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:w-[450px] w-[90%] rounded-lg">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            Resume and remove your resume data from our server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between w-full pt-2 gap-4">
          <Button
            type="submit"
            variant={"outline"}
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={"default"}
            onClick={handleDeleteResume}
            className="w-full"
          >
            {isPending && !isError ? (
              <span className="flex gap-2">
                <Loader2 className="animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteResumePopup;
