import apiClient from "@/services/apiClient";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: Array<{ [key: string]: any }>;
  userId: string;
  userName: string;
  tags: string[];
  currentSlug: string;
  image?: string;
  blogVideo?: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
  likeCount: number;
  commentCount: number;
  _createdAt: Date;
}

interface LikeToggleResult {
  isLiked: boolean;
}

interface LikeStatus {
  isLiked: boolean;
}
export interface Comment {
  _id: string;
  blog:string;
  userId: string;
  userName: string;
  content: string;
  _createdAt:Date;
};


export const getData = async (): Promise<BlogPost[]> => {
  try {
    const response = await apiClient.get<BlogPost[]>('sanityblogs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await apiClient.get<BlogPost>(`sanityblogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    throw error;
  }
};



export const toggleBlogLike = async (blogId: string, userId: string)=> {
  try {
    const response = await apiClient.post(`sanityblogs/${blogId}/like`, { userId });
    console.log("data",response)
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for blog ${blogId}:`, error);
    throw error;
  }
};

export const getBlogLikeStatus = async (blogId: string, userId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<LikeStatus>(`sanityblogs/${blogId}/like-status`, {
      params: { userId }
    });
    console.log("--datavaluereturn",response.data)
    return response.data.isLiked;
  } catch (error) {
    console.error(`Error fetching like status for blog ${blogId}:`, error);
    throw error;
  }
};

export const getComments = async (blogId: string): Promise<Comment[]> => {
  try {
    const response = await apiClient.get<Comment[]>(`sanityblogs/${blogId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for blog ${blogId}:`, error);
    throw error;
  }
};

export const createComment = async (blogId: string, userId: string, userName: string, content: string): Promise<Comment> => {
  try {
    const response = await apiClient.post<Comment>(`sanityblogs/${blogId}/comments`, {
      userId,
      userName,
      content
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating comment for blog ${blogId}:`, error);
    throw error;
  }
};
