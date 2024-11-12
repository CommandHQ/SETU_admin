
import { MilitaryProfile } from "@/types";
import apiClient from "../apiClient";

export const getMilitaryProfilebyProfileID = async (id: string) => {
  try {
    const response = await apiClient.get(`militaryexp/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createMilitaryProfile = async (data: Omit<MilitaryProfile, 'id'>): Promise<MilitaryProfile> => {
  try {
    const response = await apiClient.post("militaryexp", data);
    return response.data;
  } catch (error) {
    console.log(error)

    throw error;
  }
};

export const updateMilitaryProfile = async (id: string, data: Omit<MilitaryProfile, 'id'>): Promise<MilitaryProfile> => {
  try {
    const response = await apiClient.put(`militaryexp/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMilitaryProfile = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`militaryexp/${id}`);
  } catch (error) {
    throw error;
  }
};