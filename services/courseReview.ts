import apiClient from "@/services/apiClient";

// create course review
export const createCourseReview = async (userId: string, courseId: string, rating: number, comment: string) => {
  try {
    const response = await apiClient.post('/coursereview', { userId, courseId, rating, comment });
    return response.data; // Return the created course review data
  } catch (error) {
    console.error("Error creating course review:", error);
    throw error; 
  }
};

// delete course review 
export const deleteCourseReview = async (id: string) => {
  try {
    const response = await apiClient.delete(`/coursereview/${id}`);
    return response.data; // Optionally return the response data if needed
  } catch (error) {
    console.error("Error deleting course review:", error);
    throw error;
  }
};

// get course reviews based on course id 
export const getCourseReviewsByCourseId = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/coursereview/course/${courseId}`);
    console.log("API Response:", response.data);
    return response.data; // Return the course reviews for the specified course
  } catch (error) {
    console.error("Error fetching course reviews by course ID from API:", error);
    throw error;
  }
};

// get all course reviews
export const getAllCourseReviews = async () => {
  try {
    const response = await apiClient.get('/coursereview');
    return response.data; // Return all course reviews
  } catch (error) {
    console.error("Error fetching all course reviews:", error);
    throw error;
  }
};

// get course review by ID
export const getCourseReviewById = async (id: string) => {
  try {
    const response = await apiClient.get(`/coursereview/${id}`);
    return response.data; // Return the course review for the specified ID
  } catch (error) {
    console.error("Error fetching course review by ID:", error);
    throw error;
  }
};

// update course review
export const updateCourseReview = async (id: string, updateData: { rating?: number, comment?: string }) => {
  try {
    const response = await apiClient.put(`/coursereview/${id}`, updateData);
    return response.data; // Return the updated course review data
  } catch (error) {
    console.error("Error updating course review:", error);
    throw error;
  }
};

export const getCourseReviewsByUserId = async (userId: string) => {
         try {
           const response = await apiClient.get(`/coursereview/user/${userId}`);
           console.log("API Response:", response.data);
           return response.data; // Return the course reviews for the specified user
         } catch (error) {
           console.error("Error fetching course reviews by user ID from API:", error);
           throw error;
         }
       };
       
export default apiClient;