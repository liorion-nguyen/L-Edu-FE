import { LoadingOutlined } from '@ant-design/icons';
import { notification, Spin } from 'antd';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUser, setAuth } from '../../redux/slices/auth';
import { localStorageConfig } from '../../config';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const callbackHandledRef = useRef(false);
    const POST_LOGIN_REDIRECT_KEY = 'post-login-redirect';

    useEffect(() => {
        if (callbackHandledRef.current) return;
        callbackHandledRef.current = true;

        const handleOAuthCallback = async () => {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            const error = searchParams.get('error');

            if (error) {
                notification.error({
                    key: 'oauth-login-error',
                    message: 'Đăng nhập thất bại',
                    description: `Lỗi: ${decodeURIComponent(error)}`,
                });
                navigate('/login');
                return;
            }

            if (accessToken && refreshToken) {
                // Store tokens in localStorage
                localStorage.setItem(localStorageConfig.accessToken, accessToken);
                localStorage.setItem(localStorageConfig.refreshToken, refreshToken);

                // Update Redux state
                dispatch(setAuth({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    isAuthenticated: true,
                }));

                // Get user data
                await dispatch(getUser() as any);

                notification.success({
                    key: 'oauth-login-success',
                    message: 'Đăng nhập thành công',
                    description: 'Chào mừng bạn đến với L-Edu!',
                });

                const returnTo = localStorage.getItem(POST_LOGIN_REDIRECT_KEY);
                if (returnTo) localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
                navigate(returnTo || '/');
            } else {
                notification.error({
                    key: 'oauth-login-error',
                    message: 'Đăng nhập thất bại',
                    description: 'Không thể xác thực tài khoản.',
                });
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-dark px-6">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#007fff" }} spin />} />
            <p className="text-sm text-slate-400">Đang xử lý đăng nhập...</p>
        </div>
    );
};

export default OAuthCallback; 