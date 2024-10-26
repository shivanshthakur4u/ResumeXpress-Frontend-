"use client";

import { axios } from "../config";
import { formData } from "../types/authTypes";

export const userSignup = async (formData: formData) => {
  return axios({
    method: "POST",
    url: "user/register",
    data: formData,
  });
};

export const userLogin = async (formData: formData) => {
  return axios({
    method: "POST",
    url: "user/signin",
    data: formData,
  });
};

export const userForgotPassword = async (formData: formData) => {
  return axios({
    method: "POST",
    url: "user/forgot-password",
    data: formData,
  });
};

export const userResetPassword = async (formData: formData) => {
  return axios({
    method: "POST",
    url: "user/reset-password",
    data: formData,
  });
};
