import apiClient from './api';
import type {
  ClassSummary,
  ClassDetail,
  SessionItem,
  MyAttendanceRecord,
  SessionNote,
  ScheduleEvent,
} from '../types/class';

const API_URL = '/classes';

class StudentClassService {
  async getMyClasses(): Promise<ClassSummary[]> {
    const response = await apiClient.get<{ success: boolean; data: ClassSummary[] }>(
      `${API_URL}/my-classes`,
    );
    return response.data?.data ?? [];
  }

  async getClassDetail(id: string): Promise<ClassDetail> {
    const response = await apiClient.get<{ success: boolean; data: ClassDetail }>(
      `${API_URL}/${id}`,
    );
    return response.data!.data;
  }

  async getClassSessions(classId: string): Promise<SessionItem[]> {
    const response = await apiClient.get<{ success: boolean; data: SessionItem[] }>(
      `${API_URL}/${classId}/sessions`,
    );
    return response.data?.data ?? [];
  }

  async getMyAttendances(classId: string): Promise<MyAttendanceRecord[]> {
    const response = await apiClient.get<{ success: boolean; data: MyAttendanceRecord[] }>(
      `${API_URL}/${classId}/my-attendances`,
    );
    return response.data?.data ?? [];
  }

  async getSessionNote(classId: string, sessionId: string): Promise<SessionNote> {
    const response = await apiClient.get<{ success: boolean; data: SessionNote }>(
      `${API_URL}/${classId}/notes/${sessionId}`,
    );
    return (
      response.data?.data ?? {
        sessionContent: '',
        homework: '',
        studentComments: [],
      }
    );
  }

  /** Notes for Admin/Teacher dashboard routes: GET /dashboard/classes/:id/notes/:sessionId */
  async getDashboardSessionNote(classId: string, sessionId: string): Promise<SessionNote> {
    const response = await apiClient.get<{ success: boolean; data: SessionNote }>(
      `/dashboard/classes/${classId}/notes/${sessionId}`,
    );
    return (
      response.data?.data ?? {
        sessionContent: "",
        homework: "",
        studentComments: [],
      }
    );
  }

  async getMySchedule(params?: { from?: string; to?: string }): Promise<ScheduleEvent[]> {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await apiClient.get<{ success: boolean; data: ScheduleEvent[] }>(
      `${API_URL}/my-schedule${suffix}`,
    );
    return response.data?.data ?? [];
  }

  /** Nội dung bài học (session) - dùng API public GET /session/:id */
  async getSessionContent(sessionId: string): Promise<{ _id: string; title: string; notesMd?: { notesMd?: string }; sessionNumber?: number } | null> {
    try {
      const response = await apiClient.get<{ data?: { _id: string; title: string; notesMd?: { notesMd?: string }; sessionNumber?: number } }>(
        `/session/${sessionId}`,
      );
      const data = response.data as any;
      return data?.data ?? data ?? null;
    } catch {
      return null;
    }
  }
}

export const studentClassService = new StudentClassService();
