import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification, Spin } from 'antd';

const GoogleCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        console.log('Google callback URL:', window.location.href);
        
        // Lấy URL hiện tại để extract tokens và user info từ query params
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const userInfoStr = urlParams.get('user_info');
        const errorParam = urlParams.get('error');
        
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('User Info:', userInfoStr);
        console.log('Error param:', errorParam);
        
        if (errorParam) {
          setError(`Lỗi từ Google: ${errorParam}`);
          notification.error({
            message: 'Đăng nhập thất bại',
            description: `Lỗi: ${errorParam}`,
          });
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        if (accessToken && refreshToken && userInfoStr) {
          try {
            // Parse user info
            const userInfo = JSON.parse(userInfoStr);
            console.log('Parsed user info:', userInfo);
            
            // Lưu tokens vào localStorage
            localStorage.setItem('jwt-access-token', accessToken);
            localStorage.setItem('jwt-refresh-token', refreshToken);
            
            // Lưu thông tin user vào localStorage
            localStorage.setItem('user_info', JSON.stringify(userInfo));
            
            notification.success({
              message: 'Đăng nhập thành công',
              description: `Chào mừng ${userInfo.fullName} đến với L-Edu!`,
            });
            
            // Redirect về trang chủ sau 1 giây
            setTimeout(() => navigate('/'), 1000);
          } catch (parseError) {
            console.error('Error parsing user info:', parseError);
            setError('Lỗi khi xử lý thông tin người dùng');
            notification.error({
              message: 'Đăng nhập thất bại',
              description: 'Có lỗi khi xử lý thông tin người dùng.',
            });
            setTimeout(() => navigate('/login'), 2000);
          }
        } else {
          setError('Thiếu thông tin cần thiết từ Google');
          notification.error({
            message: 'Đăng nhập thất bại',
            description: 'Không thể xác thực với Google. Vui lòng thử lại.',
          });
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setError('Có lỗi xảy ra trong quá trình xử lý');
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
        });
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large" />
        <p style={{ color: '#666', fontSize: '16px' }}>Đang xử lý đăng nhập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f5f5f5'
      }}>
        <p style={{ color: '#ff4d4f', fontSize: '16px' }}>{error}</p>
        <p style={{ color: '#666', fontSize: '14px' }}>Đang chuyển hướng về trang đăng nhập...</p>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
