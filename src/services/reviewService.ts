import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/reviews`;

export interface Review {
  _id: string;
  userId: string | {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  courseId: string | {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isAnonymous: boolean;
  isHidden?: boolean;
  editCount?: number;
  lastEditedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  course?: {
    _id: string;
    name: string;
  };
}

export interface CreateReviewData {
  courseId: string;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isAnonymous?: boolean;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  courseId?: string;
  userId?: string;
  status?: string;
  rating?: number;
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
}

export interface ReviewStatsResponse {
  success: boolean;
  message: string;
  data: ReviewStats;
}

class ReviewService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createReview(data: CreateReviewData): Promise<ReviewResponse> {
    const response = await axios.post(API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getReviews(params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await axios.get(API_URL, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  async getCourseReviews(courseId: string, params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await axios.get(`${API_URL}/course/${courseId}`, {
      params,
    });
    return response.data;
  }

  async getMyReviews(params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await axios.get(`${API_URL}/my-reviews`, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  async getReviewStats(courseId?: string): Promise<ReviewStatsResponse> {
    const response = await axios.get(`${API_URL}/stats`, {
      params: courseId ? { courseId } : {},
    });
    return response.data;
  }

  async getReviewById(id: string): Promise<ReviewResponse> {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<ReviewResponse> {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateReviewStatus(id: string, status: string): Promise<ReviewResponse> {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const reviewService = new ReviewService();
