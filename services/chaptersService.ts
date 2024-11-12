import { Chapter } from "@/types";
import apiClient from "@/services/apiClient";

// Create a new Chapters
export const createChapter = async (chapterData: Chapter) => {
  try {
    const response = await apiClient.post("/chapters", chapterData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get chapters by course id
export const getChaptersbyId = async (id: string) => {
  try {
    const response = await apiClient.get(`/chapters/course/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateChapter = async (id: string, data: Partial<Chapter>) => {
  try {
    const response = await apiClient.put(`chapters/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating Chapters:", error);
    throw error;
  }
};

export const deleteChapterbyId = async (id: string) => {
  try {
    const response = await apiClient.delete(`/chapters/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
