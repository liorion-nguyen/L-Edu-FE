import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token xác thực không hợp lệ');
      return;
    }

    // Call backend to verify email
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/email-verification/verify`, {
        params: { token }
      });
      
      setVerificationStatus('success');
      setMessage(response.data.message);
      setEmail(response.data.email);
    } catch (error: any) {
      setVerificationStatus('error');
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Có lỗi xảy ra khi xác thực email');
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />} 
              size="large"
            />
            <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
              Đang xác thực email...
            </p>
          </div>
        );

      case 'success':
        return (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Xác thực email thành công!"
            subTitle={
              <div>
                <p>Email <strong>{email}</strong> đã được xác thực thành công.</p>
                <p>Tài khoản của bạn đã được kích hoạt và bạn có thể đăng nhập ngay bây giờ.</p>
              </div>
            }
            extra={[
              <Button type="primary" key="login" onClick={handleGoToLogin} size="large">
                Đăng nhập ngay
              </Button>,
              <Button key="home" onClick={handleGoToHome} size="large">
                Về trang chủ
              </Button>,
            ]}
          />
        );

      case 'error':
        return (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Xác thực email thất bại"
            subTitle={
              <div>
                <Alert
                  message={message}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <p>Có thể token đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.</p>
              </div>
            }
            extra={[
              <Button type="primary" key="login" onClick={handleGoToLogin} size="large">
                Đăng nhập
              </Button>,
              <Button key="home" onClick={handleGoToHome} size="large">
                Về trang chủ
              </Button>,
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;

