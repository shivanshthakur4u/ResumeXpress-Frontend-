import CVIcon from "@/assets/CvIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Notebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteResumePopup from "./DeleteResumePopup";

function ResumeCardItems({
  resume,
  resumeId,
}: {
  resume: any;
  resumeId: string;
}) {
  // console.log("resume data card:", resume);
  const [showDelDialog, setShowDelDialog] = useState(false);
  const router = useRouter();
  return (
    <div
      className="bg-gradient-to-b
    from-blue-100 via-purple-200 to-blue-300
  h-[280px] rounded-lg border-t-4 cursor-pointer  hover:scale-105"
      style={{
        borderColor: resume?.themeColor || "#007DFE",
      }}
    >
      <Link href={"/dashboard/resume/" + resumeId + "/edit"}>
        <div className="flex justify-center items-center h-[228px]">
          <CVIcon />
        </div>
      </Link>
      <div
        className="self-end float-end  h-12 w-full 
      flex rounded-b-lg justify-between items-center px-4"
        style={{
          background: resume?.themeColor || "#007DFE",
        }}
      >
        <p className="text-white text-sm">
            {resume?.title?.length > 40 ? `${resume?.title.slice(0, 40)}...`: resume?.title}
          </p>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical size={24} color="#fff" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.push("/dashboard/resume/" + resumeId + "/edit")
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/my-resume/" + resumeId + "/view")}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/my-resume/" + resumeId + "/view")}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setShowDelDialog(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeleteResumePopup open={showDelDialog} setOpen={setShowDelDialog} resumeId={resumeId} />
    </div>
  );
}

export default ResumeCardItems;
