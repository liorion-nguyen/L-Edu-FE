import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Alert } from 'antd';
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
          <div className="py-10 text-center">
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />} 
              size="large"
            />
            <p className="mt-5 text-base text-slate-400">
              Đang xác thực email...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircleOutlined className="mb-4 text-5xl text-green-500" />
            <h2 className="mb-2 text-3xl font-bold text-slate-50">Xác thực email thành công!</h2>
            <p className="mb-1 text-slate-300">
              Email <strong>{email}</strong> đã được xác thực thành công.
            </p>
            <p className="mb-8 text-slate-400">Tài khoản của bạn đã được kích hoạt và bạn có thể đăng nhập ngay bây giờ.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button type="primary" onClick={handleGoToLogin} size="large">
                Đăng nhập ngay
              </Button>
              <Button onClick={handleGoToHome} size="large">
                Về trang chủ
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <CloseCircleOutlined className="mb-4 text-5xl text-red-500" />
            <h2 className="mb-4 text-3xl font-bold text-slate-50">Xác thực email thất bại</h2>
            <Alert
              message={message}
              type="error"
              showIcon
              className="mb-4 text-left"
            />
            <p className="mb-8 text-slate-400">Có thể token đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button type="primary" onClick={handleGoToLogin} size="large">
                Đăng nhập
              </Button>
              <Button onClick={handleGoToHome} size="large">
                Về trang chủ
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark px-6 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-[#25364d] bg-[rgba(18,30,48,0.85)] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;

