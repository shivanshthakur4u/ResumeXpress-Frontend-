"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      updateAxiosInstance(parsedUser.token);
    }
  }, []);

  const updateUser = (user: User | null) => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), { expires: 2 });
      // router.push("/dashboard");
      updateAxiosInstance(user.token);
    } else {
      Cookies.remove("user");
    }
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
