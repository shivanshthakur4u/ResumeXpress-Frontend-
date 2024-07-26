import CVIcon from "@/assets/CvIcon";
import { Skeleton } from "@/components/ui/skeleton";

function ResumeCardLoader() {
  return (
    <Skeleton
      className="
  h-[280px] rounded-lg border-t-4"
    >
      <Skeleton className="flex justify-center items-center h-[228px]">
        <Skeleton className="w-[100px] h-[100px] rounded-sm bg-gray-200" />
      </Skeleton>

      <Skeleton
        className="self-end float-end  h-12 w-full 
      flex rounded-b-lg justify-between items-center px-4 bg-gray-200"
      >
        <Skeleton className="w-20 h-2" />
        <Skeleton className="w-6 h-6" />
      </Skeleton>
    </Skeleton>
  );
}

export default ResumeCardLoader;
