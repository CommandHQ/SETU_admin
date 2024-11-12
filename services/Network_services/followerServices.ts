import apiClient from "@/services/apiClient";

// Follow a user
export const followUser = async (followerId: string, followingId: string) => {
  try {
    const response = await apiClient.post("/follow/follow", { followerId, followingId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    const response = await apiClient.delete("/follow/unfollow", { data: { followerId, followingId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get followers of a user
export const getFollowers = async (userId: string) => {
  try {
    const response = await apiClient.get(`/follow/followers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get users that a user is following
export const getFollowing = async (userId: string) => {
  try {
    const response = await apiClient.get(`/follow/following`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get followers count of a user
export const getFollowersCount = async (userId: string) => {
  try {
    const response = await apiClient.get(`/follow/followers/count`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get following count of a user
export const getFollowingCount = async (userId: string) => {
  try {
    const response = await apiClient.get(`/follow/following/count`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if a user is following another user
export const isFollowing = async (followerId: string, followingId: string) => {
  try {
    const response = await apiClient.get("/follow/check", {
      params: { followerId, followingId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getPendingFollowRequests = async () => {
  try {
    const response = await apiClient.get('/follow/pending-requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Respond to a follow request
export const respondToFollowRequest = async (
  requestId: string, 
  response: 'accept' | 'reject'
): Promise<void> => {
  try {
    await apiClient.post(`/follow/respond-request/${requestId}`, { response });
  } catch (error) {
    throw error;
  }
};

