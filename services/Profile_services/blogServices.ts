
import { Blog } from "@/types";
import apiClient from "@/services/apiClient";

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PostResponse {
  data: {
    posts: Blog[];
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const createBlogs = async (blogData: any): Promise<Blog> => {
    try {
        console.log(blogData)
      const response = await apiClient.post("blogs", blogData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getBlogs = async (params?: any): Promise<{ blogs: Blog[] }> => {
    try {
      const response = await apiClient.get("blogs", { params });
      // Return the part of the response that contains the blogs
      return response.data; // { blogs: Blog[], total: number }
    } catch (error) {
      throw error;
    }
  };
  
  export const updateBlogs = async (id: string, shopData: any): Promise<Blog> => {
    try {
      const response = await apiClient.put(`blogs/${id}`, shopData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteBlogs = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`blogs/${id}`);
    } catch (error) {
      throw error;
    }
  };

  export const recentBlogs = async () => {
    try {
      const response = await apiClient.get(`blogs/recent-blog/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getAllUserBlog = async (id: string, params?: PaginationParams): Promise<PostResponse> => {
    try {
      const response = await apiClient.get<PostResponse>(`posts/all-userblog/`, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };
  