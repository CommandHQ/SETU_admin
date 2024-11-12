import { Lesson } from "@/types";
import apiClient from "@/services/apiClient";

// Create a new Lessons
export const createLessons = async (lessonData: Lesson) => {
  try {
    const response = await apiClient.post("/lessons", lessonData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get lessons by chapter id
export const getLessonsByChapterId = async (id: string) => {
  try {
    const response = await apiClient.get(`/lessons/chapter/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLesson = async (id: string, data: Partial<Lesson>) => {
  try {
    const response = await apiClient.put(`lessons/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating lessons:", error);
    throw error;
  }
};

export const deleteLessonbyId = async (id: string) => {
  try {
    const response = await apiClient.delete(`/lessons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
