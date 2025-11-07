import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Col,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { UserType } from "../../../types/user";

const { Option } = Select;
const { TextArea } = Input;

type ProfileUpdatePayload = Partial<Omit<UserType, "_id" | "email" | "password" | "createdAt" | "updatedAt">>;

type UpdateProfileProps = {
  user: UserType;
  onSubmit: (updatedData: ProfileUpdatePayload) => Promise<void>;
};

type LocationItem = {
  id: string;
  name: string;
};

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UpdateProfile: React.FC<UpdateProfileProps> = ({ user, onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);
  const provinceValue = Form.useWatch("province", form);
  const districtValue = Form.useWatch("district", form);

  useEffect(() => {
    const styleId = "profile-update-form-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerText = `
      .profile-upload-btn:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45), 0 0 15px rgba(78, 205, 196, 0.35);
      }
      .profile-submit-btn:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45), 0 0 15px rgba(78, 205, 196, 0.35);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const json = await response.json();
        setProvinces(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!provinceValue) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceValue}.htm`);
        const json = await response.json();
        setDistricts(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [provinceValue]);

  useEffect(() => {
    if (!districtValue) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtValue}.htm`);
        const json = await response.json();
        setWards(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        setWards([]);
      }
    };

    fetchWards();
  }, [districtValue]);

  useEffect(() => {
    if (!user.address?.province) return;

    const initialiseLocation = async () => {
      try {
        if (user.address?.province) {
          const districtRes = await fetch(`https://esgoo.net/api-tinhthanh/2/${user.address.province}.htm`);
          const districtJson = await districtRes.json();
          setDistricts(Array.isArray(districtJson?.data) ? districtJson.data : []);
        }
        if (user.address?.district) {
          const wardRes = await fetch(`https://esgoo.net/api-tinhthanh/3/${user.address.district}.htm`);
          const wardJson = await wardRes.json();
          setWards(Array.isArray(wardJson?.data) ? wardJson.data : []);
        }
      } catch (error) {
        // ignore silently
      }
    };

    initialiseLocation();
  }, [user.address?.district, user.address?.province]);

  const locationOptions = useMemo(
    () => ({ provinces, districts, wards }),
    [districts, provinces, wards]
  );

  const handleUploadChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
  };

  const handleFinish = async (values: any) => {
    try {
      let avatar = user.avatar ?? undefined;
      if (fileList[0]?.originFileObj) {
        avatar = await getBase64(fileList[0].originFileObj as File);
      }

      const address = values.province && values.district && values.ward
        ? {
            province: values.province,
            district: values.district,
            ward: values.ward,
          }
        : undefined;

      const phone = values.country || values.phoneNumber
        ? {
            country: values.country ?? "",
            number: values.phoneNumber ?? "",
          }
        : undefined;

      const payload: ProfileUpdatePayload = {
        fullName: values.fullName?.trim(),
        avatar,
        birthday: values.birthday ? values.birthday.toISOString() : undefined,
        gender: values.gender || undefined,
        bio: values.bio?.trim() || undefined,
        address,
        phone,
      };

      Object.keys(payload).forEach((key) => {
        const typedKey = key as keyof ProfileUpdatePayload;
        if (payload[typedKey] === undefined || payload[typedKey] === null || payload[typedKey] === "") {
          delete payload[typedKey];
        }
      });

      await onSubmit(payload);
      message.success("Cập nhật hồ sơ thành công!");
      setFileList([]);
    } catch (error) {
      message.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        fullName: user.fullName,
        birthday: user.birthday ? moment(user.birthday) : undefined,
        gender: user.gender,
        bio: user.bio || "",
        province: user.address?.province,
        district: user.address?.district,
        ward: user.address?.ward,
        country: user.phone?.country,
        phoneNumber: user.phone?.number,
      }}
    >
      <Form.Item name="avatar">
        <Flex align="center" vertical gap={18}>
          <Avatar
            size={120}
            src={user.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
            icon={<UserOutlined />}
            style={styles.avatar}
          />
          <Upload
            accept="image/*"
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} style={styles.uploadButton} className="profile-upload-btn">
              Cập nhật ảnh đại diện
            </Button>
          </Upload>
        </Flex>
      </Form.Item>

      <Form.Item
        name="fullName"
        label={<span style={styles.label}>Họ và tên</span>}
        rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
      >
        <Input style={styles.input} placeholder="Nguyễn Văn A" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="birthday"
            label={<span style={styles.label}>Ngày sinh</span>}
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker style={styles.input} format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="gender"
            label={<span style={styles.label}>Giới tính</span>}
          >
            <Select style={styles.input} placeholder="Chọn giới tính">
              <Option value="Male">Nam</Option>
              <Option value="Female">Nữ</Option>
              <Option value="Other">Khác</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="bio"
        label={<span style={styles.label}>Tiểu sử</span>}
      >
        <TextArea rows={4} style={styles.input} placeholder="Chia sẻ đôi nét về bạn..." />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="province"
            label={<span style={styles.label}>Tỉnh/Thành phố</span>}
            rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
          >
            <Select
              style={styles.input}
              placeholder="Chọn tỉnh"
              loading={!locationOptions.provinces.length}
            >
              {locationOptions.provinces.map((province) => (
                <Option key={province.id} value={province.id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="district"
            label={<span style={styles.label}>Quận/Huyện</span>}
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select
              style={styles.input}
              placeholder="Chọn quận"
              disabled={!provinceValue}
              loading={!!provinceValue && !locationOptions.districts.length}
            >
              {locationOptions.districts.map((district) => (
                <Option key={district.id} value={district.id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="ward"
            label={<span style={styles.label}>Phường/Xã</span>}
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              style={styles.input}
              placeholder="Chọn phường"
              disabled={!districtValue}
              loading={!!districtValue && !locationOptions.wards.length}
            >
              {locationOptions.wards.map((ward) => (
                <Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name="country"
            label={<span style={styles.label}>Mã quốc gia</span>}
            rules={[{ required: true, message: "Vui lòng nhập mã quốc gia" }]}
          >
            <Input style={styles.input} placeholder="+84" />
          </Form.Item>
        </Col>
        <Col xs={24} md={16}>
          <Form.Item
            name="phoneNumber"
            label={<span style={styles.label}>Số điện thoại</span>}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^\d{8,11}$/,
                message: "Số điện thoại phải từ 8 đến 11 chữ số",
              },
            ]}
          >
            <Input style={styles.input} placeholder="000000000" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={styles.submitButton} className="profile-submit-btn" block>
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfile;

const styles: Record<string, CSSProperties> = {
  label: {
    color: "#B0E0E6",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)",
  },
  input: {
    background: "rgba(78, 205, 196, 0.05)",
    border: "1px solid rgba(78, 205, 196, 0.2)",
    color: "#B0E0E6",
  },
  uploadButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)",
    border: "none",
    color: "#0A2E2E",
    fontWeight: 600,
  },
  submitButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)",
    border: "none",
    color: "#0A2E2E",
    fontWeight: 600,
    padding: "12px 16px",
  },
  avatar: {
    backgroundColor: "#4ECDC4",
    color: "#0A2E2E",
  },
};