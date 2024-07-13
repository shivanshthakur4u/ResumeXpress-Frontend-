
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_STRAPI_API_KEY;

// console.log("api key:", API_KEY)
const axiosInstance = axios.create({
    baseURL: 'http://localhost:1337/api/',
    headers:{
        'Content-Type': 'application/json',
         'Authorization':`Bearer ${API_KEY}`
    }
});

export { axiosInstance as axios}
