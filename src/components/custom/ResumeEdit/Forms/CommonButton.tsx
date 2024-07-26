import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface CommonButtonProps {
  title: string;
  AddAction: () => void;
  RemoveAction: () => void;
  onSave: () => void;
  isPending: boolean;
  isError: boolean;
  listLength:number;
}

function CommonButton({
  title,
  AddAction,
  RemoveAction,
  onSave,
  isError,
  isPending,
  listLength,
}: CommonButtonProps) {
  return (
    <div className="flex md:justify-between md:flex-row flex-col max-sm:gap-4">
      <div className="flex gap-2 md:flex-row flex-col">
        <Button variant="outline" className="text-primary" onClick={AddAction}>
          + Add More {title}
        </Button>
        {listLength > 1 && (
          <Button
            variant="outline"
            className="text-primary"
            onClick={RemoveAction}
          >
            - Remove
          </Button>
        )}
      </div>
      <Button onClick={() => onSave()}>
        {isPending && !isError ? <Loader2 className="animate-spin" /> : "Save"}
      </Button>
    </div>
  );
}

export default CommonButton;
