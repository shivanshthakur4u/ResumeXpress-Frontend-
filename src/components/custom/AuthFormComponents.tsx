"use client";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRegisteruser, useSignin } from "@/lib/queryHooks/authHooks";
import { useRouter } from "next/navigation";
import { AuthContext, AuthContextType } from "@/context/authUserContext";

interface AuthFormComponentsProps {
  isSignin: boolean;
}

const formFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type FormFields = typeof formFields;

function AuthFormComponents({ isSignin }: AuthFormComponentsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormFields>(formFields);
  const [confirmPasswordsShow, setConfirmPasswordShow] = useState(false);
  const { user } = useContext(AuthContext) as AuthContextType;

  const router = useRouter();

  const postAction = () => {
    router.push("/dashboard");
  };

  // user register mutation
  const {
    mutate: registerUser,
    isError,
    isPending,
  } = useRegisteruser(postAction);

  // signin action mutation
  const {
    mutate: signinUser,
    isError: isSigninError,
    isPending: isSigninPending,
  } = useSignin(postAction);

  // toggle passwords icon
  const handleIconToggle = (type: string) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    }
    if (type === "cnfpassword") {
      setConfirmPasswordShow(!confirmPasswordsShow);
    }
  };

  // handle input change function
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as keyof FormFields]: value });
    setError(null);
    // console.log("form data", formData);
  };

  // form submit action
  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (
      !isSignin &&
      formData &&
      formData?.password !== formData?.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    if (!isSignin) {
      const { confirmPassword, ...restData } = formData;
      registerUser({ ...restData });
    }
    if(isSignin){
      const { confirmPassword, name, ...restData } = formData;
    signinUser({...restData});
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={onSave}
          className="flex flex-col md:gap-6 gap-3 h-full w-full md:px-20 px-6"
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
                    onClick={() => handleIconToggle("password")}
                    className="cursor-pointer icon"
                  />
                ) : (
                  <EyeOff
                    onClick={() => handleIconToggle("password")}
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
                    type={confirmPasswordsShow ? "text" : "password"}
                    className="grow border-none outline-none hover:outline-none
                      focus:outline-none focus:border-none focus-visible:ring-white"
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    required
                  />
                  {confirmPasswordsShow ? (
                    <Eye
                      onClick={() => handleIconToggle("cnfpassword")}
                      className="cursor-pointer icon"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => handleIconToggle("cnfpassword")}
                      className=" cursor-pointer icon"
                    />
                  )}
                </label>
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
            )}
          </div>
          <div className="flex w-full justify-between md:gap-6 gap-4">
            <Button
              type="reset"
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
              {isSignin ? (
                isSigninPending && !isSigninError ? (
                  <span className="flex gap-2 items-center">
                    <Loader2 className="animate-spin" /> Logging in...
                  </span>
                ) : (
                  "Login"
                )
              ) : isPending && !isError ? (
                <span className="flex gap-2 items-center">
                  <Loader2 className="animate-spin" /> Signing up...
                </span>
              ) : (
                "Signup"
              )}
            </Button>
          </div>
          {/* login */}
          <p className=" justify-center items-center text-gray-500  gap-2 flex">
            {isSignin ? "Don't" : "Already"} have an account?
            <Link
              href={`/auth/${isSignin ? "signup" : "login"}`}
              className="text-primary font-bold"
            >
              {isSignin ? "Sign up" : "Login"}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AuthFormComponents;
