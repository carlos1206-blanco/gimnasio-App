import axios, { isAxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
export const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function resolveUploadUrl(path: string): string {
  return `${SERVER_ORIGIN}${path}`;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const habiaSesion = Boolean(localStorage.getItem("token"));
    if (habiaSesion && isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
