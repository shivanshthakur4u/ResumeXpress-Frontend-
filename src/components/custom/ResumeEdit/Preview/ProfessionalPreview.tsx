import React from "react";

function ProfessionalPreview({ resumeInfo }: { resumeInfo: any }) {
  return (
    <div className="my-6">
      <h2
        className=" text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        Professional Experience
      </h2>
      <hr
        className=""
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />
      {resumeInfo?.experience?.map((experience: any, index: string) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between" style={{}}>
            {experience?.companyName}, {experience?.city}, {experience.state}
            <span>
              {experience?.startDate} {" - "}
              {experience?.currentlyWorking ? "Present" : experience?.endDate}
            </span>
          </h2>
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{
              __html: experience?.workSummary,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProfessionalPreview;
