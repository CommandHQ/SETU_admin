import apiClient from "@/services/apiClient";

// create 
export const createCertification = async (profileId: string, certificationMasterId: string) => {
  try {
    const response = await apiClient.post('/profile_certification', { profileId, certificationMasterId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//delete
export const deleteCertification = async (id: string) => {
  try {
    const response = await apiClient.delete(`/profile_certification/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// get all certifications based on profile id 
export const getCertificationsByProfileId = async (profileId: string) => {
         try {
           const response = await apiClient.get(`/profile_certification/profile/${profileId}`);
           console.log("API Response:", response.data); 
           return response.data; 
         } catch (error) {
           console.error("Error fetching certifications by profile ID from API:", error);
           throw error; 
         }
       };

export default apiClient;