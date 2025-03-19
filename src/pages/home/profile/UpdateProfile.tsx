import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Upload, message, Space, Avatar, Flex } from "antd";
import { CSSProperties } from "react";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { UserType } from "../../../types/user";

const { Option } = Select;
const { TextArea } = Input;

interface UpdateProfileProps {
  user: UserType;
  onSubmit: (updatedData: any) => void;
}

interface Location {
  id: string;
  name: string;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ user, onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => setProvinces(data.data));
  }, []);

  useEffect(() => {
    if (form.getFieldValue("province")) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${form.getFieldValue("province")}.htm`)
        .then((response) => response.json())
        .then((data) => setDistricts(data.data));
    }
  }, [form.getFieldValue("province")]);

  useEffect(() => {
    if (form.getFieldValue("district")) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${form.getFieldValue("district")}.htm`)
        .then((response) => response.json())
        .then((data) => setWards(data.data));
    }
  }, [form.getFieldValue("district")]);

  const handleFinish = (values: any) => {
    const updatedData = {
      fullName: values.fullName,
      avatar: fileList.length > 0 ? fileList[0].thumbUrl : user.avatar,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toDate() : undefined,
      gender: values.gender,
      bio: values.bio,
      address: {
        province: values.province,
        district: values.district,
        ward: values.ward,
      },
      phone: {
        country: values.country,
        number: values.phoneNumber,
      },
    };
    onSubmit(updatedData);
    message.success("Profile updated successfully!");
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  console.log(user);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        fullName: user.fullName,
        dateOfBirth: user.birthday ? moment(user.birthday) : null,
        gender: user.gender,
        bio: user?.bio || "",
        province: user.address?.province,
        district: user.address?.district,
        ward: user.address?.ward,
        country: user.phone?.country,
        phoneNumber: user.phone?.number,
      }}
    >
      <Form.Item
        name="avatar"
      >
        <Flex align="center" vertical gap={20}>
          <Avatar
            size={120}
            src={user.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
            icon={<UserOutlined />}
            style={styles.avatar}
          />
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent automatic upload
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} style={styles.uploadButton}>
              Upload Avatar
            </Button>
          </Upload>
        </Flex>
      </Form.Item>

      <Form.Item
        name="fullName"
        label={<span style={styles.label}>Full Name</span>}
        rules={[{ required: true, message: "Please enter your full name" }]}
      >
        <Input style={styles.input} />
      </Form.Item>

      <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
        <Form.Item
          name="dateOfBirth"
          label={<span style={styles.label}>Date of Birth</span>}
          rules={[{ required: true, message: "Please select your date of birth" }]}
        >
          <DatePicker style={styles.input} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="gender"
          label={<span style={styles.label}>Gender</span>}
        >
          <Select style={styles.input}>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </Space>

      <Form.Item
        name="bio"
        label={<span style={styles.label}>Bio</span>}
      >
        <TextArea rows={4} style={styles.input} placeholder="Tell us about yourself..." />
      </Form.Item>

      <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
        <Form.Item
          name="province"
          label={<span style={styles.label}>Province</span>}
          rules={[{ required: true, message: "Please select your province" }]}
        >
          <Select
            style={styles.input}
            onChange={(value) => {
              form.setFieldsValue({ province: value, district: undefined, ward: undefined });
            }}
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="district"
          label={<span style={styles.label}>District</span>}
          rules={[{ required: true, message: "Please select your district" }]}
        >
          <Select
            style={styles.input}
            onChange={(value) => form.setFieldsValue({ district: value, ward: undefined })}
            disabled={!form.getFieldValue("province")}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ward"
          label={<span style={styles.label}>Ward</span>}
          rules={[{ required: true, message: "Please select your ward" }]}
        >
          <Select style={styles.input} disabled={!form.getFieldValue("district")}>
            {wards.map((ward) => (
              <Option key={ward.id} value={ward.id}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Space>


      <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
        <Form.Item
          name="country"
          label={<span style={styles.label}>Country Code</span>}
          rules={[{ required: true, message: "Please enter the country code" }]}
          style={{ flex: 1 }}
        >
          <Input style={styles.input} placeholder="+84" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label={<span style={styles.label}>Phone Number</span>}
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^\d{8,11}$/,
              message: "Phone number must be between 8 and 11 digits",
            },
          ]}
          style={{ flex: 2 }}
        >
          <Input style={styles.input} placeholder="000 000 000" />
        </Form.Item>
      </Space>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={styles.submitButton} block>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfile;

const styles: {
  label: CSSProperties;
  input: CSSProperties;
  uploadButton: CSSProperties;
  submitButton: CSSProperties;
  avatar: CSSProperties
} = {
  label: {
    color: "#B0E0E6", // Pale teal for labels
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  input: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  uploadButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  submitButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  avatar: {
    backgroundColor: "#4ECDC4", // Brighter teal for avatar
    color: "#0A2E2E", // Dark teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
};

// Add hover effects using CSS
const styleSheetUpdateProfile = document.createElement("style");
styleSheetUpdateProfile.innerText = `
  .upload-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .submit-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetUpdateProfile);