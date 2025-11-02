import axios from "axios";
const BACKEND_API_URL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
});
