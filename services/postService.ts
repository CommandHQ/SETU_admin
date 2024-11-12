import { Commentpost, Post, Savedpost } from "@/types";
import apiClient from "@/services/apiClient";

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PostResponse {
  data: {
    posts: Post[];
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

interface PostsData {
  content: string;
  image: File[];
}

// Create a new post
export const createPost = async (postsData: PostsData) => {
  try {
    const formData = new FormData();
    formData.append("content", postsData.content);
    if (postsData.image && postsData.image.length > 0) {
      for (const img of postsData.image) {
        formData.append("image", img);
      }

    }
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      console.log(`${key}:`, value);
    }
    const response = await apiClient.post("/posts", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (id: string, Data: Partial<PostsData>) => {
  try {
    const response = await apiClient.put(`/posts/${id}`, Data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const recentPost = async () => {
  try {
    const response = await apiClient.get(`posts/recent-post/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPost = async () => {
  try {
    const response = await apiClient.get(`posts/all/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUserPost = async (id: string, params?: PaginationParams): Promise<PostResponse> => {
  try {
    console.log("--datavalue",params)
    const response = await apiClient.get<PostResponse>(`posts/all-userpost/`, {
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


export const addLike = async (
  postId: string | null,
  blogId: string | null
): Promise<void> => {
  try {
    await apiClient.post(`/posts/${postId}/like`);
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

// Add a comment to a post
export const addPostComment = async (
  postId: string,
  content: string
) => {
  try {
   const comment = await apiClient.post(`/posts/${postId}/comment`, { content });
   return comment.data as Commentpost; 
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Toggle like on a post
export const toggleLike = async (
  postId: string | null,
  action: 'add' | 'remove' = 'add'
)=> {
  try {
    await apiClient.post(`/posts/like`, {action});
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const getPostComments = async (
  postId: string,
  params?: PaginationParams
) => {
  try {
    const response = await apiClient.get(`/posts/${postId}/postcomment`, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });
    return response.data ;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createSavedPost = async (savedPostData:Savedpost) => {
  try {
    const response = await apiClient.post("/posts/saved-posts", savedPostData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSavedPost = async (id: string) => {
  try {
    const response = await apiClient.get(`/posts/saved-posts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserSavedPosts = async (userId: string) => {
  try {
    const response = await apiClient.get(`/posts/users/saved-posts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSavedPost = async (id: string) => {
  try {
    const response = await apiClient.delete(`/posts/saved-posts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};