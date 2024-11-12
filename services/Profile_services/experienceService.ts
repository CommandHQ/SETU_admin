
import { Experience, Profile } from "@/types";
import apiClient from "@/services/apiClient";



export const getExperiencebyProfileId= async (id:string) => {
  try {
    const response = await apiClient.get(`experience/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}; 

export const createExperience= async (data: any) => {
    try {
      const response = await apiClient.post("experience",data);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };  

  export const updateExperience = async (id: string, data: Partial<Experience>): Promise<Experience> => {
    try {
      const response = await apiClient.put(`experience/${id}`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteExperience = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`experience/${id}`);
    } catch (error) {
      throw error;
    }
  };