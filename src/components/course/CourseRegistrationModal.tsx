import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import courseRegistrationService, { CreateRegistrationData } from '../../services/courseRegistrationService';

interface CourseRegistrationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  courseId: string;
  courseTitle: string;
  isLocked?: boolean;
  isRejected?: boolean;
}

const CourseRegistrationModal: React.FC<CourseRegistrationModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  courseId,
  courseTitle,
  isLocked = false,
  isRejected = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const registrationData: CreateRegistrationData = {
        courseId,
        message: values.message,
      };

      await courseRegistrationService.createRegistration(registrationData);
      
      const successMessage = isLocked 
        ? 'Đơn đăng ký khóa học đã được gửi thành công! Khóa học này đang bị khóa, admin sẽ xem xét và phản hồi sớm nhất.'
        : isRejected
        ? 'Đơn đăng ký khóa học mới đã được gửi thành công! Admin sẽ xem xét lại đơn đăng ký của bạn.'
        : 'Đơn đăng ký khóa học đã được gửi thành công! Admin sẽ xem xét và phản hồi sớm nhất.';
      
      message.success(successMessage);
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đơn đăng ký';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined style={{ color: 'var(--primary-color, #1890ff)' }} />
          <span style={{ color: 'var(--text-primary)' }}>Đăng ký khóa học</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
      style={{
        top: 20,
      }}
      styles={{
        header: {
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
        },
        body: {
          background: 'var(--bg-primary)',
          padding: '24px',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      <div style={{ 
        marginBottom: '16px', 
        padding: '12px', 
        background: isLocked ? 'var(--warning-bg, #fff7e6)' : 'var(--bg-secondary, #f0f2f5)', 
        borderRadius: '6px',
        border: isLocked ? '1px solid var(--warning-color, #faad14)' : '1px solid var(--border-color)',
        color: 'var(--text-primary)'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Khóa học:</strong> 
        <span style={{ color: 'var(--text-primary)' }}> {courseTitle}</span>
        {isLocked && (
          <div style={{ 
            marginTop: '4px', 
            fontSize: '12px', 
            color: 'var(--warning-color, #d48806)',
            fontWeight: 'bold'
          }}>
            ⚠️ Khóa học này đang bị khóa, cần admin duyệt
          </div>
        )}
        {isRejected && (
          <div style={{ 
            marginTop: '4px', 
            fontSize: '12px', 
            color: 'var(--error-color, #ff4d4f)',
            fontWeight: 'bold'
          }}>
            ❌ Đơn đăng ký trước đã bị từ chối, bạn có thể đăng ký lại
          </div>
        )}
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="message"
          label={<span style={{ color: 'var(--text-primary)' }}>Lời nhắn (tùy chọn)</span>}
          rules={[
            {
              max: 500,
              message: 'Lời nhắn không được quá 500 ký tự',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={
              isLocked 
                ? "Hãy chia sẻ lý do bạn muốn tham gia khóa học này, kinh nghiệm hiện tại của bạn, hoặc bất kỳ thông tin nào khác để admin có thể đánh giá và duyệt đơn đăng ký của bạn..."
                : isRejected
                ? "Đơn đăng ký trước của bạn đã bị từ chối. Hãy chia sẻ thêm thông tin, kinh nghiệm mới, hoặc lý do tại sao bạn nghĩ mình phù hợp với khóa học này..."
                : "Hãy chia sẻ lý do bạn muốn tham gia khóa học này, kinh nghiệm hiện tại của bạn, hoặc bất kỳ thông tin nào khác mà bạn muốn admin biết..."
            }
            showCount
            maxLength={500}
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            styles={{
              textarea: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              },
              count: {
                color: 'var(--text-secondary)',
              }
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            onClick={handleCancel} 
            style={{ 
              marginRight: '8px',
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SendOutlined />}
            style={{
              background: 'var(--primary-color, #1890ff)',
              borderColor: 'var(--primary-color, #1890ff)',
            }}
          >
            Gửi đơn đăng ký
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: isLocked ? 'var(--warning-bg, #fff7e6)' : 'var(--info-bg, #e6f7ff)', 
        borderRadius: '6px',
        fontSize: '13px',
        color: isLocked ? 'var(--warning-color, #d48806)' : 'var(--primary-color, #1890ff)',
        border: isLocked ? '1px solid var(--warning-color, #faad14)' : '1px solid var(--primary-color, #1890ff)'
      }}>
        <strong style={{ color: 'inherit' }}>Lưu ý:</strong> {isLocked 
          ? 'Đơn đăng ký của bạn sẽ được gửi đến admin để xem xét. Khóa học này đang bị khóa nên cần admin duyệt trước khi bạn có thể tham gia. Bạn sẽ nhận được thông báo khi đơn đăng ký được duyệt hoặc từ chối.'
          : 'Đơn đăng ký của bạn sẽ được gửi đến admin để xem xét. Bạn sẽ nhận được thông báo khi đơn đăng ký được duyệt hoặc từ chối.'
        }
      </div>
    </Modal>
  );
};

export default CourseRegistrationModal;
