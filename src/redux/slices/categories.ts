import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoryService, Category } from '../../services/categoryService';

type CategoriesState = {
  list: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params?: { limit?: number; isActive?: boolean }) => {
    const response = await categoryService.getCategories({
      limit: params?.limit ?? 1000,
      isActive: params?.isActive ?? true,
    });
    return response.data ?? [];
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch categories';
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
