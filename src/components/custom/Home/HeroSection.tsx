"use client";
import { Button } from "@/components/ui/button";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

function HeroSection() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const router = useRouter();
  const handleRedirect = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };
  return (
    <div>
      {/* heading/para*/}
      <div className="flex flex-col gap-5 items-center justify-center md:my-10 my-5 max-sm:px-6">
        <h1 className="text-center text-5xl font-medium text-gray-800 max-sm:text-3xl">
          Take Your Career <br /> Search To The Next Level.
        </h1>
        <p className="text-center text-gray-500 font-medium text-base">
          Use Professional field tested resume templates that follow the exact
          &apos;resume rules&apos;
          <br className="max-sm:hidden block" />
          employers look&apos;s for. Easy to use and done within minutes-try now
          for free!
        </p>
      </div>
      {/* buttons */}
      <div className="flex justify-center gap-6">
        <Button onClick={handleRedirect}>+ Start Creating</Button>
        {user ? (
          <Button
            variant={"outline"}
            className="text-primary hover:text-primary hover:bg-primary/10 px-5"
            onClick={handleRedirect}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="text-primary hover:text-primary hover:bg-primary/10 px-5"
            onClick={handleRedirect}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default HeroSection;
