import { userLogin, userSignup } from "../queries/authQueries";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/context/authUserContext";
import toast from "react-hot-toast";
import { updateAxiosInstance } from "../config";


export const useRegisteruser = (postAction?: () => void) => {
  const { setUser } = useContext(AuthContext) as AuthContextType;
  return useMutation({
    mutationFn: userSignup,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occurred");
    },
    onSuccess: (data) => {
      if (data?.data?.data) {
        toast.success("User Created successfully");
        const userData = JSON.parse(data.data.data);
        setUser(userData);
        updateAxiosInstance(userData.token);
        if (postAction) postAction();
      } else {
        toast.error("Unexpected response format");
      }
    },
  });
};

export const useSignin = (postAction?: () => void) => {
  const { setUser } = useContext(AuthContext) as AuthContextType;
  return useMutation({
    mutationFn: userLogin,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Some error has occurred");
    },
    onSuccess: (data) => {
      if (data?.data?.data) {
        toast.success("User logged in successfully");
        const userData = data.data.data;
        setUser(userData);
        updateAxiosInstance(userData.token);
        if (postAction) postAction();
      } else {
        toast.error("Unexpected response format");
      }
    },
  });
};
