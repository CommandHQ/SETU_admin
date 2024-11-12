import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to inject the Bearer token into the headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      // Skip adding the Authorization header if the route is /api/auth
      if (!config.url?.includes("/api/auth")) {
        config.headers.Authorization = `Bearer ${
          (session?.user as { accessToken: string }).accessToken
        }`;
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    return config;
  },
  (error) => {
    console.error("Interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
