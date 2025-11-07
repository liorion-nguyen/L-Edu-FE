import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showNotification } from '../../components/common/Toaster';
import { envConfig, localStorageConfig } from '../../config';
import { ToasterType } from '../../enum/toaster';
import { AuthenticationState, LoginRequestType, LoginResponseType, RegisterRequestType } from '../../types/auth';
import { UserType } from '../../types/user';

type RegisterFailureAction = PayloadAction<string>;
type LoginFailureAction = PayloadAction<string>;
type ForgotPasswordFailureAction = PayloadAction<string>;
type ResetPasswordFailureAction = PayloadAction<string>;
type SetUser = PayloadAction<UserType>;
type SetAuth = PayloadAction<{ access_token: string; refresh_token: string; isAuthenticated: boolean }>;
type UpdateUserParams = { id: string; data: Partial<Omit<UserType, '_id' | 'email' | 'password'>> };

const initialState: AuthenticationState = {
    loading: false,
    isAuthenticated: false,
    errorMessage: '',
    forgotEmailSent: false,
    open: '',
    user: null
};

// Async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (registerData: RegisterRequestType, { rejectWithValue }) => {
        try {
            await axios.post(`${envConfig.serverURL}/auth/signup`, registerData);
            showNotification(ToasterType.success, 'Registration saved! Please check your email for confirmation.');
            return true;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Registration failed', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (loginData: LoginRequestType, { dispatch, rejectWithValue }) => {
        try {
            const result = await axios.post(`${envConfig.serverURL}/auth/login`, loginData);
            const data: LoginResponseType = result.data ? result.data.data : null;
            if (data) {
                localStorage.setItem(localStorageConfig.accessToken, data.access_token);
                localStorage.setItem(localStorageConfig.refreshToken, data?.refresh_token || '');
                await dispatch(getUser());
                return true;
            }
            return false;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(`${envConfig.serverURL}/auth/logout`, {
                refresh_token: localStorage.getItem(localStorageConfig.refreshToken),
            });
            localStorage.removeItem(localStorageConfig.accessToken);
            localStorage.removeItem(localStorageConfig.refreshToken);
            showNotification(ToasterType.success, 'Logout successful');
            return true;
        } catch (error) {
            showNotification(ToasterType.error, 'Logout failed');
            return rejectWithValue('Logout failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            await axios.post(`${envConfig.serverURL}/auth/forgot-password`, { email });
            toast.success('Code has been sent to your email');
            return true;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const verifyCode = createAsyncThunk(
    'auth/verifyCode',
    async (verifyCodeRequest: { email: string, code: string }, { rejectWithValue }) => {
        try {
            await axios.post(`${envConfig.serverURL}/auth/verify-code`, verifyCodeRequest);
            toast.success('New password has been sent to your email');
            return true;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ key, newPassword }: { key: string, newPassword: string }, { rejectWithValue }) => {
        try {
            await axios.post(`/auth/reset/reset-password/${key}`, {
                password: newPassword,
            });
            toast.success('Your password has been successfully updated!');
            return true;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/users`);
            return result.data.data;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'User not found', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ id, data }: UpdateUserParams, { rejectWithValue }) => {
        try {
            const result = await axios.put(`${envConfig.serverURL}/users/${id}`, data);
            const updatedUser: UserType = result.data?.data || result.data;
            showNotification(ToasterType.success, 'Profile updated successfully');
            return updatedUser;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Failed to update profile', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const authenticationSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // REGISTER
        registerRequest: (state: AuthenticationState) => {
            state.loading = true;
        },
        registerSuccess: (state: AuthenticationState) => {
            state.loading = false;
        },
        registerFailure: (state: AuthenticationState, action: RegisterFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        // LOGIN
        loginRequest: (state: AuthenticationState) => {
            state.loading = true;
        },
        loginSuccess: (state: AuthenticationState) => {
            state.loading = false;
            state.isAuthenticated = true;
        },
        loginFailure: (state: AuthenticationState, action: LoginFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        // LOGOUT
        logoutAction: (state: AuthenticationState) => {
            state.isAuthenticated = false;
        },
        // FORGOT PASSWORD
        forgotPasswordRequest: (state: AuthenticationState) => {
            state.forgotEmailSent = false;
            state.loading = true;
        },
        forgotPasswordSuccess: (state: AuthenticationState) => {
            state.forgotEmailSent = true;
            state.loading = false;
        },
        forgotPasswordFailure: (state: AuthenticationState, action: ForgotPasswordFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        // RESET PASSWORD
        resetPasswordRequest: (state: AuthenticationState) => {
            state.loading = true;
        },
        resetPasswordSuccess: (state: AuthenticationState) => {
            state.loading = false;
        },
        resetPasswordFailure: (state: AuthenticationState, action: ResetPasswordFailureAction) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        setUser: (state: AuthenticationState, action: SetUser) => {
            state.loading = false;
            state.user = action.payload;
        },
        // OAUTH AUTH
        setAuth: (state: AuthenticationState, action: SetAuth) => {
            state.loading = false;
            state.isAuthenticated = action.payload.isAuthenticated;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state) => {
                state.loading = false;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.forgotEmailSent = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.forgotEmailSent = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Verify Code
            .addCase(verifyCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyCode.fulfilled, (state) => {
                state.loading = false;
                state.forgotEmailSent = true;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Get User
            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload as UserType;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const { setAuth } = authenticationSlice.actions;
export default authenticationSlice.reducer;