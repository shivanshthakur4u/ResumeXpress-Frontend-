"use client";
import { Facebook, Heart, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  const SocialIcons = [
    {
      id: 1,
      icon: <Facebook size={14} color="#fff" />,
      link: "https://www.facebook.com/",
    },
    {
      id: 2,
      icon: <Instagram size={14} color="#fff" />,
      link: "https://www.facebook.com/",
    },
    {
      id: 3,
      icon: <Twitter size={14} color="#fff" />,
      link: "https://www.facebook.com/",
    },
  ];
  const date = new Date();
  return (
    <div className="flex lg:mx-20 md:mx-10 mx-6 flex-col gap-6">
      <div className="flex justify-between items-center">
        {/* brand */}
        <Link href={"/"}>
          <h1 className="text-primary md:text-2xl text-xl text-center font-bold">
            <span className="text-black">Resume</span>Xpress
          </h1>
        </Link>
        {/* social icons */}
        <div className="flex md:gap-6 gap-4">
          {SocialIcons?.map((item) => (
            <div
              className="rounded-full md:h-10 h-7 cursor-pointer md:w-10 w-7 bg-primary text-white text-xs flex  items-center justify-center"
              key={item?.id}
            >
              {item?.icon}
            </div>
          ))}
        </div>
      </div>
      {/* line */}
      <div className="w-full h-[1px] bg-gray-300" />
      <div className="flex md:justify-between md:flex-row flex-col pb-6 max-sm:self-center max-sm:gap-4">
        <span className="text-gray-500 max-sm:text-xs">
          Copyright {date?.getFullYear()}-ResumeXpress
        </span>
        <p className="flex gap-2 text-gray-500 max-sm:text-xs  items-center">
          Made With{" "}
          <Heart color="red" fill="red" className="md:h-5 md:w-5 h-3 w-3" />
          <Link
            href={"https://portfolio-webapp-ochre.vercel.app/"}
            target="_blank"
            className="text-primary font-medium max-sm:text-xs"
          >
            
              Saurabh Singh
        
          </Link>
        </p>
        <p className="text-gray-500 max-sm:text-xs max-sm:text-center">
          All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
