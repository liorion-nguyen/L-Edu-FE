import { notification } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import { getUser, setAuth } from '../../redux/slices/auth';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            const error = searchParams.get('error');

            if (error) {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: `Lỗi: ${decodeURIComponent(error)}`,
                });
                navigate('/login');
                return;
            }

            if (accessToken && refreshToken) {
                // Store tokens in localStorage
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);

                // Update Redux state
                dispatch(setAuth({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    isAuthenticated: true,
                }));

                // Get user data
                await dispatch(getUser() as any);

                notification.success({
                    message: 'Đăng nhập thành công',
                    description: 'Chào mừng bạn đến với L-Edu!',
                });

                navigate('/');
            } else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: 'Không thể xác thực tài khoản.',
                });
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, dispatch]);

    return <Loading />;
};

export default OAuthCallback; 