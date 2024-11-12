import { Resource } from "@/types";
import apiClient from "@/services/apiClient";
const TIMEOUT = 30000; // 30 seconds

export const createResource = async (resourceData: Resource) => {
  try {
    const formData = new FormData();

    Object.entries(resourceData).forEach(([key, value]) => {
      if (key === "url" && value instanceof File) {
        formData.append("file", value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.post("/resources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: TIMEOUT,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};

export const getResourcebylessonId = async (id: string) => {
  try {
    const response = await apiClient.get(`/resources/lesson/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResourcebyId = async (
  id: string,
  resourceData: Partial<Resource>
) => {
  try {
    const formData = new FormData();

    Object.entries(resourceData).forEach(([key, value]) => {
      if (key === "url" && value instanceof File) {
        formData.append("file", value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.put(`resources/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};
