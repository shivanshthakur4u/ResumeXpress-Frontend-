"use client";
import { userForgotPassword, userLogin, userResetPassword, userSignup } from "../queries/authQueries";
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
      toast.error(
        err?.response?.data?.message || "Some error occurred while registering"
      );
    },
    onSuccess: (response) => {
      const { data, success, message } = response?.data;
      if (success && data) {
        setUser(data);
        updateAxiosInstance(data?.token);
        toast.success(message);
        if (postAction) postAction();
      }
      else {
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
    onSuccess: (response) => {
      const { success, data } = response.data;
      if (success && data) {
        toast.success("User logged in successfully");
        setUser(data);
        updateAxiosInstance(data.token);
        if (postAction) postAction();
      } else {
        toast.error("Unexpected response format");
      }
    },
  });
};

export const useForgotPassword = (postAction?:()=>void)=>{
    return useMutation({
      mutationFn: userForgotPassword,
      onError:(err:any)=>{
        toast.error(err?.response?.data?.message || "Some error occurred while sending password reset link");
      },
      onSuccess:(response)=>{
        const { success} = response.data;
        if(success){
          toast.success("Password reset link sent to email")
        }
      }
    })
}

export const useResetPassowrd =(postAction?:()=>void)=>{
  return useMutation({
    mutationFn:userResetPassword,
    onError:(err:any)=>{
      toast.error(err?.response?.data?.message || "Some error occurred while resetting password")

    },
    onSuccess:(response)=>{
      const {success} = response.data;
      if(success){
        toast.success("Password reset successfully")
        if (postAction) postAction();
      }
    }
  })
}