import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

function HomeAccordion() {
  const AccordionData = [
    {
      id: 1,
      title: "What is ResumeXpress?",
      content:
        "ResumeXpress is a webite created using Next js, Node js and Gemini AI to create ATS friendly resume",
    },
    {
      id: 2,
      title: "Is ResumeXpress really free?",
      content:
        "ResumeXpress is a webite created for peoples is its 100% free to use",
    },
    {
      id: 3,
      title: "Can i share my resume link ?",
      content: "Yes You can share your resume live link",
    },
  ];
  return (
    <Accordion type="single" collapsible className="w-full">
      {AccordionData.map((item) => (
        <AccordionItem value={`item-${item?.id}`} key={item.id}>
          <AccordionTrigger className="md:text-xl text-lg font-semibold">
            {item?.title}
          </AccordionTrigger>
          <AccordionContent className="md:text-base text-sm font-medium text-gray-600">
            {item?.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default HomeAccordion;
