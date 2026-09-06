"use client";
import { createContext, ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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

  const updateUser = useCallback((newUser: User | null) => {
    if (newUser && newUser.token !== user?.token) {
      queryClient.clear();
      Cookies.set("user", JSON.stringify(newUser), { expires: 2, sameSite: "strict", secure: window.location.protocol === "https:" });
      updateAxiosInstance(newUser.token);
      setUser(newUser);
    } else if (!newUser) {
      Cookies.remove("user");
      queryClient.clear();
      updateAxiosInstance("");
      setUser(null);
    }
  }, [user?.token, queryClient]);

  const contextValue = useMemo(
    () => ({ user, setUser: updateUser }),
    [user, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
