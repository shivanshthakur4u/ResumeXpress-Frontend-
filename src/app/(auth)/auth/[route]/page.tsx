"use client";
import Image from "next/image";
import SigninImage from "../../../../../public/login-image.png";
import AuthFormComponents from "@/components/custom/AuthFormComponents";
import { useParams, useSearchParams } from "next/navigation";
import NotFound from "@/app/not-found";
import ForgotPassword from "@/components/custom/Auth/ForgotPassword";
import ResetPassword from "@/components/custom/Auth/ResetPassword";

function Signin() {
  const params = useParams<{ route: string }>();
  const searchParams = useSearchParams();
  
  const isSignin = params?.route === "login";
  const isSignup = params?.route === "signup";
  const isForgotPassword = params?.route === "forgot-password";
  const isResetPassword = params?.route === "reset-password";
  const resetToken = searchParams.get('token');

  if (!isSignin && !isSignup && !isForgotPassword && !isResetPassword) {
    return <NotFound />;
  }

  if (isForgotPassword) {
    return <ForgotPassword />;
  }

  if (isResetPassword) {
    if (!resetToken) {
      return <NotFound />;
    }
    return <ResetPassword token={resetToken} />;
  }

  return (
    <div className={`flex w-full md:px-16 px-6 h-full pt-10 pb-3 items-center justify-center`}>
      <div className="flex rounded-lg border-2 border-primary w-full shadow-lg md:flex-row flex-col">
        {/* image */}
        <div className="md:w-[60%] items-center justify-center flex md:border-r-2 md:border-r-primary md:bg-primary/45">
          <Image src={SigninImage} alt="login-img" priority />
        </div>

        {/* form-part */}
        <div className="md:w-[50%] w-full flex flex-col gap-6 py-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 px-3">
              <h1 className="text-primary text-4xl text-center font-bold">
                ResumeXpress
              </h1>
              {isSignin && (
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
                  <p className="text-center text-gray-500">
                    Let&apos;s Build Your Perfect Resume
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center text-primary">
                {isSignin ? "Login" : "SignUp"}
              </h2>
              <div className="text-center text-gray-500">
                {isSignin ? (
                  <p>
                    Glad to see you again 👋 <br /> Login to your account below
                  </p>
                ) : (
                  <p>Enter your details below to create your account</p>
                )}
              </div>
            </div>
          </div>
          {/* form */}
          <AuthFormComponents isSignin={isSignin} />
        </div>
      </div>
    </div>
  );
}

export default Signin;