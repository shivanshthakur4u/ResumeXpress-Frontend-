"use client";
import { createContext, ReactNode, useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { updateAxiosInstance } from "@/lib/config";

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        updateAxiosInstance(parsedUser.token);
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }
  }, []);

  const updateUser = (newUser: User | null) => {
    if (newUser && newUser.token !== user?.token) {
      Cookies.set("user", JSON.stringify(newUser), { expires: 2 });
      updateAxiosInstance(newUser.token);
      setUser(newUser);
    } else if (!newUser) {
      Cookies.remove("user");
      setUser(null);
    }
  };

  const contextValue = useMemo(
    () => ({ user, setUser: updateUser }),
    [user]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
