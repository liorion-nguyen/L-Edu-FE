import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CoursesState, CourseType } from '../../types/course';
import { dispatch } from '../store';
import { envConfig } from '../../config';
import { showNotification } from '../../components/common/Toaster';
import { ToasterType } from '../../enum/toaster';
import { initialValuesType, SessionResponse } from '../../types/session';
import { Role } from '../../enum/user.enum';

type GetCoursesSuccessAction = PayloadAction<{ courses: CourseType[] | null, totalCourse: number }>;
type GetCoursesuccessAction = PayloadAction<{ course: CourseType }>;
type GetFailureAction = PayloadAction<string>;
type GetSessionSuccessAction = PayloadAction<SessionResponse>;

const initialState: CoursesState = {
    loading: false,
    errorMessage: '',
    courses: null,
    course: null,
    session: null,
    totalCourse: 0,
};

export const CoursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        getRequest: (state: CoursesState) => {
            state.loading = true;
        },
        getCoursesSuccess: (state: CoursesState, action: GetCoursesSuccessAction) => {
            state.loading = false;
            state.courses = action.payload.courses;
            state.totalCourse = action.payload.totalCourse;
        },
        getSessionSuccess: (state: CoursesState, action: GetSessionSuccessAction) => {
            state.loading = false;
            state.session = action.payload;
        },
        getFailure: (state: CoursesState, action: GetFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        getCoursesuccess: (state: CoursesState, action: GetCoursesuccessAction) => {
            state.loading = false;
            state.course = action.payload.course;
        },
        createReviewSuccess: (state: CoursesState) => {
            state.loading = false;
        },
    },
});

export const getCourses = (page = 0, limit = 20, name = "") => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            const result = await axios.get(
                `${envConfig.serverURL}/courses/search?page=${page}&limit=${limit}&name=${name}`
            );
            const courses: CourseType[] = Array.isArray(result.data.data.data) ? result.data.data.data : [];
            dispatch(CoursesSlice.actions.getCoursesSuccess({ courses, totalCourse: result.data.data.total }));
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
        }
    };
};

export const getCourseById = (id: string) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            const result = await axios.get(`${envConfig.serverURL}/courses/${id}`);
            const course: CourseType = result.data.data;
            dispatch(CoursesSlice.actions.getCoursesuccess({ course: course }));
            return true;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to fetch course', errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
            return false;
        }
    };
};

export const updateCourse = (id: string, course: CourseType) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            await axios.put(`${envConfig.serverURL}/courses/${id}`, course);
            showNotification(ToasterType.success, 'Course updated successfully');
        }
        catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
        }
    }
};

export const createSession = (values: initialValuesType) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            await axios.post(`${envConfig.serverURL}/session`, {
                "courseId": values.courseId,
                "sessionNumber": values.sessionNumber,
                "title": values.title,
                "quizId": {
                    "quizId": values.quizId,
                    "mode": values.modeQuizId
                },
                "videoUrl": {
                    "videoUrl": values.videoUrl,
                    "mode": values.modeVideoUrl
                },
                "notesMd": {
                    "notesMd": values.notesMd,
                    "mode": values.modeNoteMd
                }
            });
            showNotification(ToasterType.success, 'Session created successfully');
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Registration failed', errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
        }
    };
}

export const getSessionById = (id: string) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            const result = await axios.get(`${envConfig.serverURL}/session/${id}`);
            const session: SessionResponse = result.data.data;
            dispatch(CoursesSlice.actions.getSessionSuccess(session));
            return true;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data.message : "Something went wrong";
            showNotification(ToasterType.error, "Failed to fetch session", errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
            return false;
        }
    };
};

export const updateSession = (id: string, values: initialValuesType) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            await axios.put(`${envConfig.serverURL}/session/${id}`, {
                "sessionNumber": values.sessionNumber,
                "title": values.title,
                "quizId": {
                    "quizId": values.quizId,
                    "mode": values.modeQuizId
                },
                "videoUrl": {
                    "videoUrl": values.videoUrl,
                    "mode": values.modeVideoUrl
                },
                "notesMd": {
                    "notesMd": values.notesMd,
                    "mode": values.modeNoteMd
                },
                "mode": values.mode
            });
            showNotification(ToasterType.success, 'Session updated successfully');
        }
        catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
        }
    };
};

export const getUsersCore = (role: Role) => {
    return async () => {
        try {
            dispatch(CoursesSlice.actions.getRequest());
            const result = await axios.get(`${envConfig.serverURL}/users/core/${role}`);
            return result.data.data;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(CoursesSlice.actions.getFailure(errorMessage));
        }
    };
}

export default CoursesSlice.reducer;
