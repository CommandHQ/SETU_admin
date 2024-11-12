import apiClient from "@/services/apiClient";

//get all courses category
export const getCourseCategory = async () => {
  try {
    const response = await apiClient.get("/coursecategory");
    return response.data;
  } catch (error) {
    throw error;
  }
};
