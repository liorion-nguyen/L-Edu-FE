import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { dispatch } from '../store';
import { CoursesState, CourseType } from '../../types/course';

type GetCoursesSuccessAction = PayloadAction<CourseType[] | null>;
type GetFailureAction = PayloadAction<string>;

const initialState: CoursesState = {
    loading: false,
    errorMessage: '',
    courses: null,
    course: null,
};

export const hotelsSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        getRequest: (state: CoursesState) => {
            state.loading = true;
        },
        getFailure: (state: CoursesState, action: GetFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        }
    },
});

export default hotelsSlice.reducer;