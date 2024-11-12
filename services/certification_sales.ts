import apiClient from "@/services/apiClient";

export const getData = async () => {
  try {
    const response = await apiClient.get("/certification-sales");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDataById = async (id: string) => {
  try {
    const response = await apiClient.get(`/certification-sales/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
