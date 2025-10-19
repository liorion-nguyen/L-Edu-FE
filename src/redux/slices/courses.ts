import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showNotification } from '../../components/common/Toaster';
import { envConfig } from '../../config';
import { ToasterType } from '../../enum/toaster';
import { Role } from '../../enum/user.enum';
import { CoursesState, CourseType } from '../../types/course';
import { initialValuesType, SessionResponse } from '../../types/session';

const initialState: CoursesState = {
    loading: false,
    errorMessage: '',
    courses: null,
    course: null,
    myCourses: null,
    session: null,
    totalCourse: 0,
};

// Async thunks
export const getCourses = createAsyncThunk(
    'courses/getCourses',
    async ({ page = 0, limit = 20, name = "", categoryId }: { page?: number; limit?: number; name?: string; categoryId?: string }) => {
        try {
            let url = `${envConfig.serverURL}/courses/search?page=${page}&limit=${limit}&name=${name}`;
            if (categoryId) {
                url += `&categoryId=${categoryId}`;
            }
            const result = await axios.get(url);
            const courses: CourseType[] = Array.isArray(result.data.data.data) ? result.data.data.data : [];
            return { courses, totalCourse: result.data.data.total };
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            throw error;
        }
    }
);

export const getCourseById = createAsyncThunk(
    'courses/getCourseById',
    async (id: string) => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/courses/${id}`);
            const course: CourseType = result.data.data;
            return course;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to fetch course', errorMessage);
            throw error;
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/updateCourse',
    async ({ id, course }: { id: string; course: CourseType }) => {
        try {
            await axios.put(`${envConfig.serverURL}/courses/${id}`, course);
            showNotification(ToasterType.success, 'Course updated successfully');
            return course;
        } catch (error: Error | any) {
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            throw error;
        }
    }
);

export const createSession = createAsyncThunk(
    'courses/createSession',
    async (values: initialValuesType) => {
        try {
            await axios.post(`${envConfig.serverURL}/dashboard/sessions`, {
                "courseId": values.courseId,
                "sessionNumber": values.sessionNumber, // Keep as string, backend will convert
                "title": values.title,
                "description": values.description || "", // Add required description field
                "mode": values.mode || "OPEN",
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
            return values;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Registration failed', errorMessage);
            throw error;
        }
    }
);

export const getSessionById = createAsyncThunk(
    'courses/getSessionById',
    async (id: string) => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/dashboard/sessions/${id}`);
            const session: SessionResponse = result.data.data;
            return session;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data.message : "Something went wrong";
            showNotification(ToasterType.error, "Failed to fetch session", errorMessage);
            throw error;
        }
    }
);

export const updateSession = createAsyncThunk(
    'courses/updateSession',
    async ({ id, values }: { id: string; values: initialValuesType }) => {
        try {
            await axios.put(`${envConfig.serverURL}/dashboard/sessions/${id}`, {
                "sessionNumber": values.sessionNumber, // Keep as string, backend will convert
                "title": values.title,
                "description": values.description || "", // Add required description field
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
                "mode": values.mode || "OPEN"
            });
            showNotification(ToasterType.success, 'Session updated successfully');
            return values;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Update failed', errorMessage);
            throw error;
        }
    }
);

export const getUsersCore = createAsyncThunk(
    'courses/getUsersCore',
    async (role: Role) => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/users/core/${role}`);
            return result.data.data;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            throw error;
        }
    }
);

export const getMyCourses = createAsyncThunk(
    'courses/getMyCourses',
    async () => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/courses/myCourse`);
            return result.data.data;
        } catch (error: Error | any) {
            const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
            toast.error(errorMessage);
            throw error;
        }
    }
);

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    async (course: Partial<CourseType>) => {
        try {
            console.log('Creating course with data:', course);
            const result = await axios.post(`${envConfig.serverURL}/courses`, course);
            console.log('Course created successfully:', result.data);
            showNotification(ToasterType.success, 'Course created successfully');
            return result.data.data;
        } catch (error: Error | any) {
            console.error('Error creating course:', error);
            const errorMessage: string = error.response ? error.response.data.message : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to create course', errorMessage);
            throw error;
        }
    }
);

export const CoursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        resetCourse: (state) => {
            state.course = null;
        },
        resetSession: (state) => {
            state.session = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getCourses
            .addCase(getCourses.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                state.totalCourse = action.payload.totalCourse;
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getCourseById
            .addCase(getCourseById.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.course = action.payload;
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // updateCourse
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(updateCourse.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // createSession
            .addCase(createSession.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(createSession.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createSession.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getSessionById
            .addCase(getSessionById.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getSessionById.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload;
            })
            .addCase(getSessionById.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // updateSession
            .addCase(updateSession.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(updateSession.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateSession.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getUsersCore
            .addCase(getUsersCore.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getUsersCore.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getUsersCore.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // getMyCourses
            .addCase(getMyCourses.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.myCourses = action.payload;
            })
            .addCase(getMyCourses.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            })
            // createCourse
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally add the new course to the courses array
                if (state.courses) {
                    state.courses.unshift(action.payload);
                    state.totalCourse += 1;
                }
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.error.message || 'Something went wrong';
            });
    }
});

export default CoursesSlice.reducer;
