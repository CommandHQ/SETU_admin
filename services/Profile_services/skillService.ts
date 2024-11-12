import apiClient from "@/services/apiClient";

// create skill
export const createSkill = async (profileId: string, skillMasterId: string) => {
  try {
    const response = await apiClient.post('/skillss', { profileId, skillMasterId });
    return response.data; // Return the created skill data
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error; // Re-throw error to handle it in the calling context
  }
};

//delete skill 
export const deleteSkill = async (id: string) => {
  try {
    const response = await apiClient.delete(`/skillss/${id}`);
    return response.data; // Optionally return the response data if needed
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

// get skills based on profile id 

export const getSkillsByProfileId = async (profileId: string) => {
  try {
    const response = await apiClient.get(`/skillss/profile/${profileId}`);
    console.log("API Response:", response.data);
    return response.data; // Return the skills for the specified profile
  } catch (error) {
    console.error("Error fetching skills by profile ID from API:", error);
    throw error;
  }
};

export default apiClient;
