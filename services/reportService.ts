import { Report } from "@/types";
import apiClient from "@/services/apiClient";

export const createReport = async (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    try {
      const response = await apiClient.post("/reports", reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getReport = async (id: string) => {
    try {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getAllReports = async () => {
    try {
      const response = await apiClient.get("/reports");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteReport = async (id: string) => {
    try {
      const response = await apiClient.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };