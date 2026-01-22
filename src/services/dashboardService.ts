import axios from 'axios';
import { envConfig } from '../config';

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
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getUserGrowthData(): Promise<UserGrowthData[]> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/stats/user-growth`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      throw error;
    }
  }

  async getCourseEnrollmentData(): Promise<CourseEnrollmentData[]> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/stats/course-enrollment`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course enrollment data:', error);
      throw error;
    }
  }

  async getChatActivityData(): Promise<ChatActivityData[]> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/stats/chat-activity`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat activity data:', error);
      throw error;
    }
  }

  async getReviewTrendsData(): Promise<ReviewTrendsData[]> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/stats/review-trends`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching review trends data:', error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<any[]> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/recent-activities`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
