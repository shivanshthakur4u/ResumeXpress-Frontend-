"use client";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

interface AuthFormComponentsProps {
  isSignin: boolean;
}

const formFields ={
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
}

type FormFields = typeof formFields

function AuthFormComponents({ isSignin }: AuthFormComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormFields |undefined>(formFields);
  const handleIconToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as keyof FormFields]: value });
    setError(null)
    console.log("form data", formData);
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!isSignin && (formData&&(formData?.password !== formData?.confirmPassword))) {
        setError("Passwords do not match");
        return;
      }
  };

  return (
    <>
      <div>
        <form
          onSubmit={onSave}
          className="flex flex-col md:gap-6 gap-4 w-full md:px-20 px-5"
        >
          <div className="grid grid-cols-1 gap-4 w-full">
            {/* name */}
            {!isSignin && (
              <div>
                <label
                  className="flex items-center gap-2 border-2 py-1 px-5 
              rounded-lg focus-within:border-primary group input-wrapper"
                >
                  <User className="h-5 w-5 icon " />
                  <Input
                    type="text"
                    name="name"
                    className="grow border-none outline-none hover:outline-none
                  focus:outline-none focus:border-none focus-visible:ring-white"
                    placeholder="Ex:Saurabh Singh"
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            )}
            {/* email */}
            <div className="">
              <label
                className="flex items-center gap-2 
                border-2 py-1 px-5 rounded-lg focus-within:border-primary input-wrapper"
              >
                <Mail className="h-5 w-5 icon " />
                <Input
                  type="text"
                  name="email"
                  className="grow border-none outline-none hover:outline-none
                    focus:outline-none focus:border-none focus-visible:ring-white"
                  placeholder="example@gmail.com"
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            {/* password */}
            <div>
              <label
                className="flex items-center gap-2 border-2
                focus-within:border-primary py-1 px-5 rounded-lg input-wrapper"
              >
                <KeyRound className="h-5 w-5 icon " />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="grow border-none outline-none hover:outline-none
                    focus:outline-none focus:border-none focus-visible:ring-white"
                  placeholder="Password"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
                {showPassword ? (
                  <Eye
                    onClick={handleIconToggle}
                    className="cursor-pointer icon"
                  />
                ) : (
                  <EyeOff
                    onClick={handleIconToggle}
                    className=" cursor-pointer icon"
                  />
                )}
              </label>
            </div>
            {/* confirm password */}
            {!isSignin && (
              <div className="flex flex-col gap-1">
                <label
                  className="flex items-center gap-2 border-2
                  focus-within:border-primary py-1 px-5 rounded-lg input-wrapper"
                >
                  <KeyRound className="h-5 w-5 icon " />
                  <Input
                    name="confirmPassword"
                    type="password"
                    className="grow border-none outline-none hover:outline-none
                      focus:outline-none focus:border-none focus-visible:ring-white"
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    required
                    
                  />
                </label>
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
            )}
          </div>
          <div className="flex w-full justify-between md:gap-6 gap-4">
            <Button
              type="button"
              className="w-full border-primary text-primary hover:text-primary
             hover:bg-primary/10"
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full border border-primary hover:bg-white hover:text-primary"
            >
              {isSignin ? "Login" : "Signup"}
            </Button>
          </div>
          {/* login */}
          {isSignin ? (
            <p className=" justify-center items-center text-gray-500  gap-2 flex">
              Don&apos;t have an account?
              <Link href={"/auth/signup"} className="text-primary font-bold">
                Signup
              </Link>
            </p>
          ) : (
            <p className=" justify-center items-center text-gray-500  gap-2 flex">
              Already have an account?
              <Link href={"/auth/login"} className="text-primary font-bold">
                Login
              </Link>
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default AuthFormComponents;
