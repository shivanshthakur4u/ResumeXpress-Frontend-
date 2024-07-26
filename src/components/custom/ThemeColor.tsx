import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateResume } from "@/lib/queryHooks/resumeHooks";

function ThemeColor() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFA1",
    "#FF7133",
    "#71FF33",
    "#7133FF",
    "#FF3371",
    "#33FF71",
    "#3371FF",
    "#A1FF33",
    "#33A1FF",
    "#FF5733",
    "#5733FF",
    "#33FF5A",
    "#5A33FF",
    "#FF335A",
    "#335AFF",
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { mutate: updateTheme, isPending, isError } = useUpdateResume();
  const params = useParams<{ Id: string }>();
  const onColorSelect = (color: string) => {
  
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });
    const data = {
      themeColor: color,
    };
    updateTheme({ formData: data, id: params?.Id });
    toast.success("Theme Color Updated");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          {" "}
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-8 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${resumeInfo?.themeColor === item && "border border-black"}
             `}
              style={{
                background: item,
              }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
