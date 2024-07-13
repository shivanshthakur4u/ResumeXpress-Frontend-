"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateNewResume } from "@/lib/queryHooks/resumeHooks";
import { useUser } from "@clerk/nextjs";
import { Loader2, PlusSquare } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
function NewResumeDialog() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const { user } = useUser();
  const {
    mutate: createResume,
    isError,
    data,
    isPending,
  } = useCreateNewResume();
//   console.log("data received:", data?.data?.data?.attributes);
  const onCreate = () => {
    const uuid = uuidv4();
    const data = {
      title: resumeTitle,
      resumeid: uuid,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
    };
    createResume(data);
  };
  return (
    <div>
      <div
        className="p-14 py-24 items-center border 
      flex justify-center bg-secondary
       rounded-lg h-[280px] 
       hover:scale-105 transition-all
        hover:shadow-md cursor-pointer border-dashed"
        onClick={() => setShowAddPopup(true)}
      >
        <PlusSquare />
      </div>
      <Dialog open={showAddPopup} onOpenChange={setShowAddPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for new resume</p>
              <Input
                className="mt-2 focus:border-none"
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
    </div>
  );
}

export default NewResumeDialog;
