import apiClient from './api';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalSessions: number;
  totalReviews: number;
  totalConversations: number;
  totalMessages: number;
  userGrowthPercentage?: number;
  courseGrowthPercentage?: number;
  sessionGrowthPercentage?: number;
  reviewGrowthPercentage?: number;
  averageRating?: number;
  activeUsersToday?: number;
  newUsersThisWeek?: number;
}

interface UserGrowthData {
  date: string;
  count: number;
}

interface CourseEnrollmentData {
  course: string;
  enrollments: number;
}

interface ChatActivityData {
  date: string;
  messages: number;
  conversations: number;
}

interface ReviewTrendsData {
  date: string;
  reviews: number;
  averageRating: number;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getUserGrowthData(): Promise<UserGrowthData[]> {
    try {
      const response = await apiClient.get('/dashboard/stats/user-growth');
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      throw error;
    }
  }

  async getCourseEnrollmentData(): Promise<CourseEnrollmentData[]> {
    try {
      const response = await apiClient.get('/dashboard/stats/course-enrollment');
      return response.data;
    } catch (error) {
      console.error('Error fetching course enrollment data:', error);
      throw error;
    }
  }

  async getChatActivityData(): Promise<ChatActivityData[]> {
    try {
      const response = await apiClient.get('/dashboard/stats/chat-activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat activity data:', error);
      throw error;
    }
  }

  async getReviewTrendsData(): Promise<ReviewTrendsData[]> {
    try {
      const response = await apiClient.get('/dashboard/stats/review-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching review trends data:', error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<any[]> {
    try {
      const response = await apiClient.get('/dashboard/recent-activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
