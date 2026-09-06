import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateAxiosInstance = (token: string) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const userCookie = Cookies.get("user");
if (userCookie) {
  try {
    const user = JSON.parse(userCookie);
    updateAxiosInstance(user?.token);
  } catch (error) {
    console.error("Error parsing user cookie:", error);
  }
}

axiosInstance.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && typeof window !== "undefined") {
    Cookies.remove("user"); updateAxiosInstance("");
    if (window.location.pathname.startsWith("/dashboard")) window.location.assign("/auth/login");
  }
  return Promise.reject(error);
});
export { axiosInstance as axios };
