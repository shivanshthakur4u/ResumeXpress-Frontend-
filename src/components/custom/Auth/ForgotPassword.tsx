import React, { useCallback, useState } from "react";
import { FormInput } from "../AuthFormComponents";
import { Loader2, Mail } from "lucide-react";
import Image from "next/image";
import ForgotImage from "../../../../public/forgotPassword.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForgotPassword } from "@/lib/queryHooks/authHooks";
function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEmail(value);
    },
    []
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== "") {
      forgotPassword({ email });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full py-10 gap-10 items-center self-end lg:flex-row flex-col px-6 lg:px-16"
    >
      {/* left side image */}
      <Image
        src={ForgotImage}
        alt="forgot-password-image"
        className="lg:h-[390px] h-full lg:w-[60%] w-full"
      />

      {/* right side */}
      <div className="flex flex-col gap-8 max-lg:w-full">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-start text-primary">
            Forgot Your Password?
          </h2>
          <p className="text-start text-gray-500">
            No worries, we will send you reset instruction
          </p>
        </div>
        {/* form */}
        <div className="flex flex-col gap-4">
          <FormInput
            type="email"
            name="email"
            placeholder="example@gmail.com"
            icon={Mail}
            onChange={handleInputChange}
          />

          <Button
            type="submit"
            className="w-full border border-primary hover:bg-white hover:text-primary"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex gap-2 items-center">
                <Loader2 className="animate-spin" />
              </span>
            ) : (
              "Send Instruction"
            )}
          </Button>
        </div>
        <p className="justify-center items-center text-gray-500 gap-2 flex">
          Don&apos;t have an account?
          <Link href={`/auth/signup`} className="text-primary font-bold">
            Sign up
          </Link>
        </p>

        <Link
          href={"/auth/login"}
          className="text-lg text-gray-400 text-center hover:text-primary"
        >
          Back to signin
        </Link>
      </div>
    </form>
  );
}

export default ForgotPassword;
