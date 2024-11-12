import apiClient from "@/services/apiClient";

export interface Education {
  nameOfUniversity: string;
  degree: string;
  grade: string;
  fieldOfStudy: string;
  yearOfEnrollment: number;
  yearOfPassing: number;
}

export interface FormData {
  userId: string;
  fullname: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  alternativeNumber: string;
  address:string;
  city:string;
  state:string;
  pincode:string;
  passportSizePhoto: string;
  service:string;
  dateOfCommission: string;
  rank: string;
  dateOfRetirement: string;
  armOrBranch: string;
  essay: string;
  resumeFile: string;
  certificationFile: string;
  education: Education[];
}

export const createApplication = async (courseData: FormData) => {
    try {
      const response = await apiClient.post("/applicationform", courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getAllApplication = async () => {
    try {
      const response = await apiClient.get('/applicationform/application');
      return response.data;
    } catch (error) {
      console.error("Error fetching all course reviews:", error);
      throw error;
    }
  };

  export const updateWithdrawalStatus = async (id: string) => {
    try {
      const response = await apiClient.put(`/applicationform/withdrawal/${id}`)
      return response.data;
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      throw error;
    }
  };
  
