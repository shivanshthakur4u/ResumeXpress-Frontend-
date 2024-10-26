import Image from "next/image";
import { FC, useCallback, useState } from "react";
import { FormFields, FormInput, INITIAL_FORM_STATE } from "../AuthFormComponents";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import resetPasswordImage from "../../../../public/reset password.png";
import { useResetPassowrd } from "@/lib/queryHooks/authHooks";
import { useRouter } from "next/navigation";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: FC<ResetPasswordProps> = ({ token }) => {
  const [confirmPasswordsShow, setConfirmPasswordShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormFields>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const postAction = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  const { mutate: resetPassword, isPending } = useResetPassowrd(postAction);

  const handleIconToggle = useCallback((type: string) => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else if (type === "cnfpassword") {
      setConfirmPasswordShow((prev) => !prev);
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value })); 
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    else{
        resetPassword({ token, newPassword: formData.password }); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full py-10 gap-10 items-center self-end lg:flex-row flex-col px-6 lg:px-16">
      {/* left side image */}
      <Image
        src={resetPasswordImage}
        alt="reset-password-image"
        className="lg:h-[390px] h-full lg:w-[60%] w-full"
      />

      {/* right side */}
      <div className="flex flex-col gap-8 max-lg:w-full w-[40%]">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-start text-primary">
            Reset Password
          </h2>
          <p className="text-start text-gray-500">
            Just type it twice and try not to forget it 😜.
          </p>
        </div>
        {/* form */}
        <div className="flex flex-col gap-4 w-full">
          <FormInput
            type="password"
            name="password"
            placeholder="New Password"
            icon={KeyRound}
            onChange={handleInputChange}
            showToggle
            onToggle={() => handleIconToggle("password")}
            showPassword={showPassword}
          />
          <div className="flex flex-col gap-1">
            <FormInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              icon={KeyRound}
              onChange={handleInputChange}
              showToggle
              onToggle={() => handleIconToggle("cnfpassword")}
              showPassword={confirmPasswordsShow}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
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
              "Reset Password"
            )}
          </Button>
        </div>

        <Link
          href={"/auth/login"}
          className="text-lg text-gray-400 text-center hover:text-primary"
        >
          Back to signin
        </Link>
      </div>
    </form>
  );
};

export default ResetPassword;
