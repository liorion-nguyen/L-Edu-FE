import apiClient from './api';

const API_URL = '/reviews';

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
  async createReview(data: CreateReviewData): Promise<ReviewResponse> {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  }

  async getReviews(params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await apiClient.get(API_URL, { params });
    return response.data;
  }

  async getCourseReviews(courseId: string, params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await apiClient.get(`${API_URL}/course/${courseId}`, { params });
    return response.data;
  }

  async getMyReviews(params?: ReviewQueryParams): Promise<ReviewListResponse> {
    const response = await apiClient.get(`${API_URL}/my-reviews`, { params });
    return response.data;
  }

  async getReviewStats(courseId?: string): Promise<ReviewStatsResponse> {
    const response = await apiClient.get(`${API_URL}/stats`, {
      params: courseId ? { courseId } : {},
    });
    return response.data;
  }

  async getReviewById(id: string): Promise<ReviewResponse> {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<ReviewResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}`, data);
    return response.data;
  }

  async updateReviewStatus(id: string, status: string): Promise<ReviewResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  }

  async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export const reviewService = new ReviewService();
