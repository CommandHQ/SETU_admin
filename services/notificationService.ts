import { Notification, NotificationType } from "@/types";
import apiClient from "@/services/apiClient";

// Create a new notification
export const createNotification = async (notificationData: {
  userId: string;
  type: NotificationType;
  content: string;
  postId?: string;
  commentId?: string;
}) => {
  try {
    const response = await apiClient.post("/notification", notificationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get notifications by user ID
export const getNotificationsByUserId = async () => {
  try {
    const response = await apiClient.get(`/notification`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await apiClient.patch(`/notification/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a like notification
export const createLikeNotification = async (postId: string) => {
  try {
    const response = await apiClient.post('/notification/like', { postId});
    return response.data;
  } catch (error) {
    console.error("Error creating like notification:", error);
    throw error;
  }
};

// Create a comment notification
export const createCommentNotification = async (postId: string) => {
  try {
    const response = await apiClient.post('/notification/comment', { postId});
    return response.data;
  } catch (error) {
    console.error("Error creating comment notification:", error);
    throw error;
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiClient.get('/notification/unread/count');
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.patch('/notification/read-all');
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};