import apiClient from "@/services/apiClient";

export const getMe = async () => {
  try {
    const response = await apiClient.get("/users/user/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserinfo = async (id: string, userData: any) => {
  try {
    const response = await apiClient.put(`/users/${id}`,userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/users/allusers");
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getRecentUsers = async () => {
  try {
    const response = await apiClient.get("/users/recentusers");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNetworkUsers = async () => {
  try {
    const response = await apiClient.get("/users/netwokusers");
    return response.data;
  } catch (error) {
    throw error;
  }
};