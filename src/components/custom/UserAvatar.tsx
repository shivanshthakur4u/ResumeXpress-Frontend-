"use client";
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import getInitials from "@/lib/getInitials";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutDropdown = memo(({ isOpen, onClose, onLogout }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Add escape key listener
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-white shadow-md border w-[120px] right-0 py-4 px-5 rounded-lg mt-1 z-50"
      role="dialog"
      aria-label="User menu"
    >
      <button
        className="w-full text-left text-gray-500 hover:text-red-500 flex items-center gap-2 transition-colors"
        onClick={onLogout}
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
});

LogoutDropdown.displayName = "LogoutDropdown";

export const UserAvatar = memo(() => {
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      setUser(null);
      Cookies.remove("user");
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  }, [setUser, router]);

  const userInitials = user?.name ? getInitials(user.name) : "?";

  return (
    <div className="relative">
      <button
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label={`User menu for ${user?.name || 'current user'}`}
      >
        <Avatar className="cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarImage
            src=""
            alt={`Avatar for ${user?.name || 'user'}`}
            className="object-cover"
          />
          <AvatarFallback
            className="bg-primary/10 text-primary"
            aria-label={`Initials: ${userInitials}`}
          >
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </button>

      <LogoutDropdown
        isOpen={isDropdownOpen}
        onClose={closeDropdown}
        onLogout={handleLogout}
      />
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;