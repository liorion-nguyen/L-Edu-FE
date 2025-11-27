export enum ExamVisibility {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum ExamQuestionType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  FILL_IN = "FILL_IN",
}

export interface ExamConfig {
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowBacktrack?: boolean;
  autoSubmit?: boolean;
  passingScore?: number;
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id?: string;
  _id: string;
  originalId?: string;
  type: ExamQuestionType;
  content: string;
  media?: string[];
  options?: ExamOption[];
  correctAnswers?: string[];
  textAnswers?: string[];
  explanation?: string;
  points: number;
  tags?: string[];
  order?: number;
}

export interface ExamSummary {
  _id: string;
  title: string;
  courseId: string;
  sessionIds?: string[];
  totalPoints: number;
  visibility: ExamVisibility;
  instructorId: string;
  config: ExamConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamDetail extends ExamSummary {
  description?: string;
  questions: ExamQuestion[];
}

export interface AttemptAnswerPayload {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
}

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "AUTO_SUBMITTED";

export interface ExamAttempt {
  _id: string;
  examId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  status: AttemptStatus;
  totalScore?: number;
  maxScore?: number;
  answers: Array<AttemptAnswerPayload & {
    isCorrect?: boolean;
    scoreEarned?: number;
  }>;
  student?: {
    _id: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
}

export interface ExamFilters {
  instructorId?: string;
  courseId?: string;
  visibility?: ExamVisibility;
}

export interface CreateExamPayload {
  title: string;
  description?: string;
  courseId: string;
  sessionIds?: string[];
  instructorId: string;
  config: ExamConfig;
  questions: Array<Omit<ExamQuestion, "_id">>;
}

export interface UpdateExamPayload extends Partial<CreateExamPayload> {}

