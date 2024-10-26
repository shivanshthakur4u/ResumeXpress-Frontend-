"use client";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import { memo, useCallback, useContext, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRegisteruser, useSignin } from "@/lib/queryHooks/authHooks";
import { useRouter } from "next/navigation";
import { AuthContext, AuthContextType } from "@/context/authUserContext";

interface AuthFormComponentsProps {
  isSignin: boolean;
}

// outside component to prevent recreation
 export const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
} as const;

// Type for form fields
export type FormFields = typeof INITIAL_FORM_STATE;

// Separate component for input field to prevent unnecessary re-renders
export const FormInput = memo(
  ({
    type,
    name,
    placeholder,
    icon: Icon,
    onChange,
    showToggle,
    onToggle,
    showPassword,
  }: {
    type: string;
    name: string;
    placeholder: string;
    icon: React.ElementType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToggle?: boolean;
    onToggle?: () => void;
    showPassword?: boolean;
  }) => (
    <label className="flex items-center gap-2 border-2 py-1 px-5 rounded-lg focus-within:border-primary group input-wrapper">
      <Icon className="h-5 w-5 icon" />
      <Input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        className="grow border-none outline-none hover:outline-none focus:outline-none focus:border-none focus-visible:ring-white"
        placeholder={placeholder}
        onChange={onChange}
        required
      />
      {showToggle && (
        <>
          {showPassword ? (
            <Eye onClick={onToggle} className="cursor-pointer icon" />
          ) : (
            <EyeOff onClick={onToggle} className="cursor-pointer icon" />
          )}
        </>
      )}
    </label>
  )
);

FormInput.displayName = "FormInput";

const AuthFormComponents = memo(({ isSignin }: AuthFormComponentsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormFields>(INITIAL_FORM_STATE);
  const [confirmPasswordsShow, setConfirmPasswordShow] = useState(false);
  const { user } = useContext(AuthContext) as AuthContextType;

  const router = useRouter();

  const postAction = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const { mutate: registerUser, isPending: isRegisterPending } =
    useRegisteruser(postAction);
  const { mutate: signinUser, isPending: isSigninPending } =
    useSignin(postAction);

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
      setError(null);
    },
    []
  );

  const onSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!isSignin && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const { confirmPassword, ...baseData } = formData;

      if (isSignin) {
        const { name, ...signinData } = baseData;
        signinUser(signinData);
      } else {
        registerUser(baseData);
      }
    },
    [formData, isSignin, registerUser, signinUser]
  );

  const isPending = isSignin ? isSigninPending : isRegisterPending;

  return (
    <form
      onSubmit={onSave}
      className="flex flex-col md:gap-6 gap-3 h-full w-full md:px-20 px-6"
    >
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-4 w-full">
          {!isSignin && (
            <FormInput
              type="text"
              name="name"
              placeholder="Ex: Saurabh Singh"
              icon={User}
              onChange={handleInputChange}
            />
          )}

          <FormInput
            type="email"
            name="email"
            placeholder="example@gmail.com"
            icon={Mail}
            onChange={handleInputChange}
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            icon={KeyRound}
            onChange={handleInputChange}
            showToggle
            onToggle={() => handleIconToggle("password")}
            showPassword={showPassword}
          />

          {!isSignin && (
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
          )}
        </div>
        {isSignin && (
          <Link
            href={"/auth/forgot-password"}
            className="self-end text-primary font-semibold cursor-pointer text-sm"
          >
            Forgot Password?
          </Link>
        )}
      </div>
      <div className="flex w-full justify-between md:gap-6 gap-4">
        <Button
          type="reset"
          className="w-full border-primary text-primary hover:text-primary hover:bg-primary/10"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full border border-primary hover:bg-white hover:text-primary"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex gap-2 items-center">
              <Loader2 className="animate-spin" />
              {isSignin ? "Logging in..." : "Signing up..."}
            </span>
          ) : isSignin ? (
            "Login"
          ) : (
            "Signup"
          )}
        </Button>
      </div>

      <p className="justify-center items-center text-gray-500 gap-2 flex">
        {isSignin ? "Don't" : "Already"} have an account?
        <Link
          href={`/auth/${isSignin ? "signup" : "login"}`}
          className="text-primary font-bold"
        >
          {isSignin ? "Sign up" : "Login"}
        </Link>
      </p>
    </form>
  );
});

AuthFormComponents.displayName = "AuthFormComponents";

export default AuthFormComponents;
