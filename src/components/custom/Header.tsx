"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import { UserAvatar } from "./UserAvatar";


function Header() {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="p-5 px-5 flex justify-between shadow-md w-full items-center">
      {/* <Image src="/logo.png" width={100} height={100} alt="logo" /> */}
      <Link href={"/"}>
        <h1 className="text-primary md:text-2xl text-xl text-center font-bold self-center">
          <span className="text-black">Resume</span>Xpress
        </h1>
      </Link>
      {user ? (
        <div className="flex gap-2 items-center">
         
          <Link href={"/dashboard"}>
            <Button
              variant={"outline"}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              Dashboard
            </Button>
          </Link>
          {/* user */}
          <UserAvatar />
        </div>
      ) : (
        <Link href={"/auth/login"}>
          <Button className="hover:bg-white hover:border-primary hover:border-2 hover:text-primary border-2">
            Get Started
          </Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
