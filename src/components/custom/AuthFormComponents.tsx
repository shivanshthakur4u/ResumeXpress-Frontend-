"use client";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import { memo, useCallback, useContext, useId, useState } from "react";
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
    autoComplete,
  }: {
    type: string;
    name: string;
    placeholder: string;
    icon: React.ElementType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToggle?: boolean;
    onToggle?: () => void;
    showPassword?: boolean;
    autoComplete?: string;
  }) => {
    const id = useId();
    const label = name === "confirmPassword" ? "Confirm password" : name === "name" ? "Full name" : name === "email" ? "Email address" : "Password";
    return <div className="space-y-2">
    <label htmlFor={id} className="block text-xs font-medium text-foreground/80">{label}</label>
    <div className="input-wrapper flex min-h-12 items-center gap-2 rounded-xl border border-input bg-background/50 px-3 transition-colors hover:border-muted-foreground/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
      <Icon className="icon h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <Input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        id={id}
        autoComplete={autoComplete ?? (name === "email" ? "email" : name === "name" ? "name" : "new-password")}
        className="auth-input min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        onFocus={event => {
          if (process.env.NODE_ENV === "development") {
            const style = getComputedStyle(event.currentTarget);
            console.debug("[DEBUG-RESUMEXPRESS-UI]", { control: "auth-field", field: name, outlineWidth: style.outlineWidth, innerShadow: style.boxShadow });
          }
        }}
        placeholder={placeholder}
        onChange={onChange}
        required
      />
      {showToggle && <button type="button" onClick={onToggle} aria-label={showPassword ? "Hide password" : "Show password"} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{showPassword ? <Eye size={19}/> : <EyeOff size={19}/>}</button>}
    </div>
    </div>;
  }
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
    router.push(isSignin ? "/dashboard" : "/dashboard/ai");
  }, [router, isSignin]);

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
      className="flex flex-col md:gap-6 gap-3 h-full w-full "
    >
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-4 w-full">
          {!isSignin && (
            <FormInput
              type="text"
              name="name"
              placeholder="Your full name"
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
            autoComplete={isSignin ? "current-password" : "new-password"}
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
              {error && <p className="text-xs text-red-400">{error}</p>}
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
          type="submit"
          className="w-full h-12"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex gap-2 items-center">
              <Loader2 className="animate-spin" />
              {isSignin ? "Signing in..." : "Creating account..."}
            </span>
          ) : isSignin ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </Button>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-muted-foreground">
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
