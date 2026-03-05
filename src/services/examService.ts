import apiClient from "./api";
import {
  AttemptAnswerPayload,
  ExamAttempt,
  ExamDetail,
  ExamFilters,
  ExamSummary,
  CreateExamPayload,
  UpdateExamPayload,
} from "../types/exam";

const API_ROOT = "/exam";

export const examService = {
  async getExams(params?: ExamFilters) {
    const response = await apiClient.get(API_ROOT, { params });
    return response.data as ExamSummary[];
  },

  async getExamDetail(examId: string) {
    const response = await apiClient.get(`${API_ROOT}/${examId}`);
    return response.data as ExamDetail;
  },

  async getExamOverview(examId: string) {
    const response = await apiClient.get(`${API_ROOT}/${examId}/overview`);
    return response.data as Pick<ExamDetail, "_id" | "title" | "description" | "config" | "totalPoints" | "visibility">;
  },

  async createExam(payload: CreateExamPayload) {
    const response = await apiClient.post(API_ROOT, payload);
    return response.data as ExamDetail;
  },

  async updateExam(examId: string, payload: UpdateExamPayload) {
    const response = await apiClient.patch(`${API_ROOT}/${examId}`, payload);
    return response.data as ExamDetail;
  },

  async publishExam(examId: string) {
    const response = await apiClient.post(`${API_ROOT}/${examId}/publish`, {});
    return response.data as ExamDetail;
  },

  async createAttempt(examId: string, payload: { studentId: string; deviceInfo?: Record<string, any> }) {
    const response = await apiClient.post(`${API_ROOT}/${examId}/attempt`, payload);
    return response.data as ExamAttempt;
  },

  async getAttempt(examId: string, attemptId: string) {
    const response = await apiClient.get(`${API_ROOT}/${examId}/attempt/${attemptId}`);
    return response.data as ExamAttempt;
  },

  async listAttempts(examId: string, params?: { studentId?: string; from?: string; to?: string }) {
    const response = await apiClient.get(`${API_ROOT}/${examId}/attempts`, { params });
    return response.data as ExamAttempt[];
  },

  async saveAttemptProgress(examId: string, attemptId: string, payload: { answers: AttemptAnswerPayload[]; deviceInfo?: Record<string, any> }) {
    const response = await apiClient.patch(`${API_ROOT}/${examId}/attempt/${attemptId}`, payload);
    return response.data as ExamAttempt;
  },

  async submitAttempt(examId: string, attemptId: string, payload?: { forceSubmit?: boolean }) {
    const response = await apiClient.post(`${API_ROOT}/${examId}/attempt/${attemptId}/submit`, payload ?? {});
    return response.data as ExamAttempt;
  },
};

