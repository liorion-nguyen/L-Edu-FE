import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";
import { examService } from "../../services/examService";
import { CreateExamPayload, ExamDetail, ExamFilters, ExamSummary, ExamVisibility, UpdateExamPayload } from "../../types/exam";

interface ExamsState {
  loading: boolean;
  items: ExamSummary[];
  selectedExam: ExamDetail | null;
  error?: string;
  filters: ExamFilters;
}

const initialState: ExamsState = {
  loading: false,
  items: [],
  selectedExam: null,
  filters: {},
};

export const fetchExams = createAsyncThunk(
  "exams/fetch",
  async (filters: ExamFilters | undefined, { rejectWithValue }) => {
    try {
      const data = await examService.getExams(filters);
      return { data, filters };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tải danh sách bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      return rejectWithValue(message);
    }
  },
);

export const fetchExamDetail = createAsyncThunk(
  "exams/detail",
  async (examId: string, { rejectWithValue }) => {
    try {
      return await examService.getExamDetail(examId);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tải chi tiết bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      return rejectWithValue(message);
    }
  },
);

export const createExam = createAsyncThunk(
  "exams/create",
  async (payload: CreateExamPayload, { rejectWithValue }) => {
    try {
      const result = await examService.createExam(payload);
      showNotification(ToasterType.success, "Exam", "Tạo bài kiểm tra thành công");
      return result;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tạo bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      return rejectWithValue(message);
    }
  },
);

export const updateExam = createAsyncThunk(
  "exams/update",
  async ({ examId, payload }: { examId: string; payload: UpdateExamPayload }, { rejectWithValue }) => {
    try {
      const result = await examService.updateExam(examId, payload);
      showNotification(ToasterType.success, "Exam", "Cập nhật bài kiểm tra thành công");
      return result;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể cập nhật bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      return rejectWithValue(message);
    }
  },
);

export const publishExam = createAsyncThunk(
  "exams/publish",
  async (examId: string, { rejectWithValue }) => {
    try {
      const result = await examService.publishExam(examId);
      showNotification(ToasterType.success, "Exam", "Đã phát hành bài kiểm tra");
      return result;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể phát hành bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      return rejectWithValue(message);
    }
  },
);

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<ExamFilters>) {
      state.filters = action.payload;
    },
    clearSelectedExam(state) {
      state.selectedExam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.filters = action.payload.filters ?? {};
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExamDetail.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchExamDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExam = action.payload;
      })
      .addCase(fetchExamDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.items = state.items.map((exam) => (exam._id === action.payload._id ? action.payload : exam));
        if (state.selectedExam && state.selectedExam._id === action.payload._id) {
          state.selectedExam = action.payload;
        }
      })
      .addCase(publishExam.fulfilled, (state, action) => {
        state.items = state.items.map((exam) => (exam._id === action.payload._id ? action.payload : exam));
        if (state.selectedExam && state.selectedExam._id === action.payload._id) {
          state.selectedExam = action.payload;
        }
      });
  },
});

export const { setFilters, clearSelectedExam } = examsSlice.actions;
export const examsReducer = examsSlice.reducer;

