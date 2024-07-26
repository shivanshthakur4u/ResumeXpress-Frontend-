import React from "react";
import HomeAccordion from "./HomeAccordion";

function FAQSection() {
  return (
    <div className="flex items-center justify-center flex-col gap-10 mb-10 md:mt-10 mt-8 md:px-6 lg:px-0">
      <div className="flex flex-col gap-6">
        <h3 className="text-primary font-semibold text-center">FAQ</h3>
        <h2 className="md:text-6xl text-3xl text-gray-800 font-bold text-center">
          Frequently Asked Questions
        </h2>
      </div>
      {/* accordion */}
      <div className="flex items-center justify-center lg:w-[55%] md:w-[90%] w-[80%]">
        <HomeAccordion />
      </div>
    </div>
  );
}

export default FAQSection;
