
import { Profile } from "@/types";
import apiClient from "@/services/apiClient";

  export const updateProfile = async (id: string, Data: any) => {
    try {
      const response = await apiClient.put("profile",Data);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  export const getProfile = async (data: any) => {
    try {
      const response = await apiClient.post("profile",data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getProfileById = async (id: string): Promise<Profile> => {
    try {
      const response = await apiClient.get(`profile/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };