import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import ResumeImage from "../../../assets/ResumeImage.png";
import StepsCard from "./StepsCard";
function ResumeStepSection() {
  return (
    <div className="flex flex-col gap-14">
      <div
        className="flex lg:mt-10 lg:gap-10 gap-5 items-center lg:flex-row flex-col
   lg:mr-20 lg:justify-start md:justify-center"
      >
    
        <Image src={ResumeImage} alt="resume-image" />
       
        <div className="flex flex-col gap-6 lg:mt-28 md:mt-20 mt-8 lg:text-start md:text-center text-center">
          <h3 className="text-primary text-xl font-semibold">How IT WORKS</h3>
          <h1 className="md:text-7xl text-4xl font-bold text-gray-800">
            3 Steps. <br /> 5 Minutes.
          </h1>
          <p className="md:text-2xl text-base text-gray-500 font-medium md:px-6 lg:px-0 px-6">
            Getting that dream job can seem like an impossible task. We&apos;re
            here to change that. Give yourself a real advantage with the best
            online AI resume maker: created by experts, imporoved by AI, trusted
            by millions of professionals.
          </p>
          <Button className="w-[200px] text-base md:p-8 p-6 rounded-full lg:self-start self-center">
            Create Resume Now
          </Button>
        </div>
      </div>
      
      <StepsCard />
     
    </div>
  );
}

export default ResumeStepSection;
