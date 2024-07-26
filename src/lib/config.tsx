import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateAxiosInstance = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

export { axiosInstance as axios };
