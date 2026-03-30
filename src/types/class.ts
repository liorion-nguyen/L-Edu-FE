export type ClassStatus = 'ACTIVE' | 'FINISHED' | 'PENDING';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'NOT_MARKED';

export interface ClassScheduleSlot {
  date: string;
  timeStart: string;
  timeEnd: string;
  teacherId?: string | null;
  mentorId?: string | null;
}

export interface ClassSummary {
  _id: string;
  name: string;
  courseId: string;
  teacherId: string | null;
  status: ClassStatus;
  scheduleFrequency?: string;
  totalSessions?: number;
  scheduleSlots?: ClassScheduleSlot[];
  course?: { _id: string; name: string };
  teacher?: { _id: string; fullName: string; email?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassDetail extends ClassSummary {
  students?: Array<{ _id: string; fullName: string; email?: string }>;
  studentCount?: number;
  enrollments?: Array<{ userId: string; enrolledAt: string }>;
}

export interface SessionItem {
  _id: string;
  title: string;
  sessionNumber: number;
  order: number;
}

export interface MyAttendanceRecord {
  sessionId: string;
  status: AttendanceStatus;
}

export interface SessionNote {
  sessionContent: string;
  homework: string;
  studentComments: Array<{ userId: string; comment: string }>;
}

export interface ScheduleEvent {
  classId: string;
  className: string;
  courseId?: string;
  courseName?: string;
  start: string; // ISO
  end: string; // ISO
  platform?: string;
}
