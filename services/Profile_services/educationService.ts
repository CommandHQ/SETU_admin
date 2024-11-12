
import { Education } from "@/types";
import apiClient from "@/services/apiClient";

export const getEducationbyProfileID = async (id: string) => {
  try {
    const response = await apiClient.get(`education/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createEducation = async (data: Omit<Education, 'id'>): Promise<Education> => {
  try {
    const response = await apiClient.post("education", data);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const updateEducation = async (id: string, data: Omit<Education, 'id'>): Promise<Education> => {
  try {
    const response = await apiClient.put(`education/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEducation = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`education/${id}`);
  } catch (error) {
    throw error;
  }
};