import { 
  Card, 
  Button, 
  Input, 
  Space, 
  Typography,
  Form,
  message,
  Divider
} from "antd";
import { 
  SaveOutlined, 
  EditOutlined
} from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const { Title } = Typography;
const { TextArea } = Input;

const FooterManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [form] = Form.useForm();

  // Mock data - sẽ được thay thế bằng API calls
  const initialValues = {
    companyName: "L-Edu",
    description: "Nền tảng học lập trình trực tuyến hàng đầu Việt Nam",
    address: "Cầu Giấy, Hà Nội, Việt Nam",
    phone: "+84 123 456 789",
    email: "liorion.nguyen@gmail.com",
    facebook: "https://www.facebook.com/chungg.203",
    gmail: "stu715105031@hnue.edu.vn",
    zalo: "https://zalo.me/your-zalo-id",
    copyright: "© 2025 - Tất cả quyền được bảo lưu bởi L-Edu.",
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      // API call để lưu footer settings
      message.success(t('dashboard.footer.saveSuccess'));
      console.log("Footer settings:", values);
    });
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <Title level={2} style={{ color: "var(--text-primary)", margin: 0 }}>
          {t('dashboard.footer.title')}
        </Title>
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={handleSave}
        >
          {t('dashboard.footer.save')}
        </Button>
      </div>

      <Card style={{ 
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Title level={4} style={{ color: "var(--text-primary)" }}>
            {t('dashboard.footer.companyInfo')}
          </Title>
          
          <Form.Item
            name="companyName"
            label={t('dashboard.footer.companyName')}
            rules={[{ required: true, message: t('dashboard.footer.companyNameRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('dashboard.footer.description')}
            rules={[{ required: true, message: t('dashboard.footer.descriptionRequired') }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Divider />

          <Title level={4} style={{ color: "var(--text-primary)" }}>
            {t('dashboard.footer.contactInfo')}
          </Title>

          <Form.Item
            name="address"
            label={t('dashboard.footer.address')}
            rules={[{ required: true, message: t('dashboard.footer.addressRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('dashboard.footer.phone')}
            rules={[{ required: true, message: t('dashboard.footer.phoneRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('dashboard.footer.email')}
            rules={[
              { required: true, message: t('dashboard.footer.emailRequired') },
              { type: "email", message: t('dashboard.footer.emailInvalid') }
            ]}
          >
            <Input />
          </Form.Item>

          <Divider />

          <Title level={4} style={{ color: "var(--text-primary)" }}>
            {t('dashboard.footer.socialLinks')}
          </Title>

          <Form.Item
            name="facebook"
            label={t('dashboard.footer.facebook')}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gmail"
            label={t('dashboard.footer.gmail')}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="zalo"
            label={t('dashboard.footer.zalo')}
          >
            <Input />
          </Form.Item>

          <Divider />

          <Title level={4} style={{ color: "var(--text-primary)" }}>
            {t('dashboard.footer.legal')}
          </Title>

          <Form.Item
            name="copyright"
            label={t('dashboard.footer.copyright')}
            rules={[{ required: true, message: t('dashboard.footer.copyrightRequired') }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FooterManagement;
