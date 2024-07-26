"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import { useContext, useEffect, useRef, useState } from "react";
import getInitials from "@/lib/getInitials";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
export function UserAvatar() {
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const [showLogout, setShowLogout] = useState(false);
  const outsideRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        outsideRef.current &&
        !outsideRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }

    if (showLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("user");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return (
    <div className="relative">
      <Avatar
        onClick={() => setShowLogout(!showLogout)}
        className="cursor-pointer"
      >
        <AvatarImage src="" alt="@shadcn" />
        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
      </Avatar>
      {showLogout && (
        <div
          className="absolute bg-white shadow-md border w-[120px] right-0 py-4 px-5 rounded-lg mt-1"
          ref={outsideRef}
        >
          <div className="cursor-pointer" onClick={() => setShowLogout(false)}>
            <p
              className="text-gray-500 hover:text-red-500 flex gap-2"
              onClick={handleLogout}
            >
            <LogOut />  Logout 
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
