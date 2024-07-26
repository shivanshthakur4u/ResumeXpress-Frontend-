import React from "react";
import { Skeleton } from "../ui/skeleton";

function SharePageLoader() {
  return (
    <div>
      <div className="my-10 max-sm:w-full flex flex-col gap-5 items-center justify-center">
        <h2 className="self-center text-2xl font-medium">
          <Skeleton className="w-full sm:w-[200px] h-4" />
        </h2>
        <div className="self-center flex flex-col gap-1">
          <Skeleton className="w-full sm:w-[400px] h-2" />
          <Skeleton className="w-full sm:w-[400px] h-2" />
        </div>

        <div className="flex justify-between gap-20 lg:px-44 px-6 my-10 items-center">
          <Skeleton className="w-20 h-10 rounded-md" />

          <Skeleton className="w-20 h-10 rounded-md" />
        </div>
      </div>

      <div
        id="print-area"
        className={
          "my-10  max-sm:w-full flex justify-center self-center"
        }
      >
        <Skeleton className="sm:w-[60%] w-full h-[400px] rounded-md mx-5" />
      </div>
    </div>
  );
}

export default SharePageLoader;
