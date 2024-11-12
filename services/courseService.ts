import { CourseData } from "@/types";
import apiClient from "@/services/apiClient";

export const createCourse = async (courseData: CourseData) => {
  try {
    const response = await apiClient.post("/courses", courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCourse = async () => {
  try {
    const response = await apiClient.get("/courses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoursebyId = async (id: string) => {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (id: string, data: Partial<CourseData>) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "thumbnail" && value instanceof File) {
        formData.append("file", value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.put(`courses/${id}`, formData, {
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

export const getCoursesByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(`/courses/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by user ID from API:", error);
    throw error;
  }
};

export const deleteCoursebyId = async (id: string) => {
  try {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
