import axios from "axios";
import { envConfig, localStorageConfig } from "../config";
import {
  AttemptAnswerPayload,
  ExamAttempt,
  ExamDetail,
  ExamFilters,
  ExamSummary,
  ExamVisibility,
  CreateExamPayload,
  UpdateExamPayload,
} from "../types/exam";

const API_ROOT = `${envConfig.serverURL}/exam`;

const withAuth = () => ({
  Authorization: `Bearer ${localStorage.getItem(localStorageConfig.accessToken)}`,
});

export const examService = {
  async getExams(params?: ExamFilters) {
    const response = await axios.get(API_ROOT, {
      params,
      headers: withAuth(),
    });
    return response.data as ExamSummary[];
  },

  async getExamDetail(examId: string) {
    const response = await axios.get(`${API_ROOT}/${examId}`, {
      headers: withAuth(),
    });
    return response.data as ExamDetail;
  },

  async getExamOverview(examId: string) {
    const response = await axios.get(`${API_ROOT}/${examId}/overview`, {
      headers: withAuth(),
    });
    return response.data as Pick<ExamDetail, "_id" | "title" | "description" | "config" | "totalPoints" | "visibility">;
  },

  async createExam(payload: CreateExamPayload) {
    const response = await axios.post(API_ROOT, payload, {
      headers: withAuth(),
    });
    return response.data as ExamDetail;
  },

  async updateExam(examId: string, payload: UpdateExamPayload) {
    const response = await axios.patch(`${API_ROOT}/${examId}`, payload, {
      headers: withAuth(),
    });
    return response.data as ExamDetail;
  },

  async publishExam(examId: string) {
    const response = await axios.post(`${API_ROOT}/${examId}/publish`, {}, {
      headers: withAuth(),
    });
    return response.data as ExamDetail;
  },

  async createAttempt(examId: string, payload: { studentId: string; deviceInfo?: Record<string, any> }) {
    const response = await axios.post(`${API_ROOT}/${examId}/attempt`, payload, {
      headers: withAuth(),
    });
    return response.data as ExamAttempt;
  },

  async getAttempt(examId: string, attemptId: string) {
    const response = await axios.get(`${API_ROOT}/${examId}/attempt/${attemptId}`, {
      headers: withAuth(),
    });
    return response.data as ExamAttempt;
  },

  async saveAttemptProgress(examId: string, attemptId: string, payload: { answers: AttemptAnswerPayload[]; deviceInfo?: Record<string, any> }) {
    const response = await axios.patch(`${API_ROOT}/${examId}/attempt/${attemptId}`, payload, {
      headers: withAuth(),
    });
    return response.data as ExamAttempt;
  },

  async submitAttempt(examId: string, attemptId: string, payload?: { forceSubmit?: boolean }) {
    const response = await axios.post(`${API_ROOT}/${examId}/attempt/${attemptId}/submit`, payload ?? {}, {
      headers: withAuth(),
    });
    return response.data as ExamAttempt;
  },
};

