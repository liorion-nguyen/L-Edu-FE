import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';
import toast from 'react-hot-toast';
import { AuthenticationState, LoginRequestType, LoginResponseType, RegisterRequestType } from '../../types/auth';
import { envConfig, localStorageConfig } from '../../config';
import { showNotification } from '../../components/common/Toaster';
import { ToasterType } from '../../enum/toaster';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../../types/user';

type RegisterFailureAction = PayloadAction<string>;
type LoginFailureAction = PayloadAction<string>;
type ForgotPasswordFailureAction = PayloadAction<string>;
type ResetPasswordFailureAction = PayloadAction<string>;
type SetUser = PayloadAction<UserType>;

const initialState: AuthenticationState = {
    loading: false,
    isAuthenticated: false,
    errorMessage: '',
    forgotEmailSent: false,
    open: '',
    user: null
};

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
        logout: (state: AuthenticationState) => {
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
    },
});

export const register = (registerData: RegisterRequestType) => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.registerRequest());
            await axios.post(`${envConfig.serverURL}/auth/signup`, registerData);
            dispatch(authenticationSlice.actions.registerSuccess());
            showNotification(ToasterType.success, 'Registration saved! Please check your email for confirmation.');
            return true;
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'Registration failed', errorMessage);
            dispatch(authenticationSlice.actions.registerFailure(errorMessage));
            return false;
        }
    };
};

export const login = (loginData: LoginRequestType) => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.loginRequest());
            const result = await axios.post(`${envConfig.serverURL}/auth/login`, loginData);
            const data: LoginResponseType = result.data ? result.data.data : null;
            showNotification(ToasterType.success, 'Login successful');
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
            showNotification(ToasterType.error, 'Invalid email or password');
            dispatch(authenticationSlice.actions.loginFailure(errorMessage));
            return false;
        }
    };
};

export const logout = () => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.logout());
            await axios.post(`${envConfig.serverURL}/auth/logout`, {
                refresh_token: localStorage.getItem(localStorageConfig.refreshToken),
            });
            localStorage.removeItem(localStorageConfig.accessToken);
            localStorage.removeItem(localStorageConfig.refreshToken);
            showNotification(ToasterType.success, 'Logout successful');
            return true;
        } catch (error) {
            showNotification(ToasterType.error, 'Logout failed');
            return false;
        }
    };
};

export const forgotPassword = (email: string) => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.forgotPasswordRequest());
            await axios.post(`${envConfig.serverURL}/auth/forgot-password`, { email });
            dispatch(authenticationSlice.actions.forgotPasswordSuccess());
            toast.success('Code has been sent to your email');
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(authenticationSlice.actions.forgotPasswordFailure(errorMessage));
        }
    };
};

export const verifyCode = (verifyCodeRequest: { email: string, code: string }) => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.forgotPasswordRequest());
            await axios.post(`${envConfig.serverURL}/auth/verify-code`, verifyCodeRequest);
            dispatch(authenticationSlice.actions.forgotPasswordSuccess());
            toast.success('New password has been sent to your email');
            // dispatch(authenticationSlice.actions.setDiaLog('login'));
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(authenticationSlice.actions.forgotPasswordFailure(errorMessage));
        }
    };
};

export const resetPassword = (key: string, newPassword: string) => {
    return async () => {
        try {
            dispatch(authenticationSlice.actions.resetPasswordRequest());
            await axios.post(`/auth/reset/reset-password/${key}`, {
                password: newPassword,
            });
            dispatch(authenticationSlice.actions.resetPasswordSuccess());
            toast.success('Your password has been successfully updated!');
        } catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            toast.error(errorMessage);
            dispatch(authenticationSlice.actions.resetPasswordFailure(errorMessage));
        }
    };
};

export const getUser = () => {
    return async () => {
        try {
            const result = await axios.get(`${envConfig.serverURL}/users`);
            dispatch(authenticationSlice.actions.setUser(result.data.data));
        }
        catch (error: Error | any) {
            const errorMessage: string = error.response
                ? error.response.data.message
                : 'Something went wrong';
            showNotification(ToasterType.error, 'User not found', errorMessage);
        }   
    }
};

export default authenticationSlice.reducer;