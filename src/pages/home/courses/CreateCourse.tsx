import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  message,
  Divider,
  Typography,
  Space,
  Progress,
  Tag,
  Tooltip
} from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  PictureOutlined,
  SaveOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Currency, Status, TypeDiscount } from "../../../enum/course.enum";
import { Role } from "../../../enum/user.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import ReturnPage from "../../../components/common/ReturnPage";
import CustomSelectMultiple from "../../../components/common/CustomSelectMultiple";
import { createCourse, getUsersCore } from "../../../redux/slices/courses";
import { useDispatch } from "../../../redux/store";
import { COLORS } from "../../../constants/colors";
import './CreateCourse.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface OptionsType {
  label: string;
  value: string;
}

interface CourseFormData {
  name: string;
  description: string;
  price: {
    currency: Currency;
    number: number;
  };
  discount: {
    type: TypeDiscount;
    number: number;
  };
  instructorId: string;
  category: string;
  cover: string;
  students: string[];
  duration: number;
  status: Status;
}

const CreateCourse: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [optionsStudents, setOptionsStudents] = useState<OptionsType[]>([]);
  const [optionsTeachers, setOptionsTeachers] = useState<OptionsType[]>([]);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    fetchUsersData();
    
    // Set default values for form
    const defaultValues = {
      price: {
        currency: Currency.VND,
        number: 0
      },
      discount: {
        type: TypeDiscount.PERCENT,
        number: 0
      },
      status: Status.ACTIVE,
      students: []
    };
    
    form.setFieldsValue(defaultValues);
  }, [dispatch, form]);

  const fetchUsersData = async () => {
    try {
      const [studentsResult, teachersResult] = await Promise.all([
        dispatch(getUsersCore(Role.STUDENT)),
        dispatch(getUsersCore(Role.TEACHER))
      ]);

      if (getUsersCore.fulfilled.match(studentsResult) && getUsersCore.fulfilled.match(teachersResult)) {
        const students = studentsResult.payload;
        const teachers = teachersResult.payload;

        if (students) {
          const studentOptions = students.map((student: any) => ({
            label: `${student.fullName} (${student.email})`,
            value: student._id
          }));
          setOptionsStudents(studentOptions);
        }

        if (teachers) {
          const teacherOptions = teachers.map((teacher: any) => ({
            label: `${teacher.fullName} (${teacher.email})`,
            value: teacher._id
          }));
          setOptionsTeachers(teacherOptions);
        }
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu người dùng");
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    console.log("Form values changed:", values);
    
    // Calculate form completion progress
    const requiredFields = ['name', 'description', 'duration', 'instructorId'];
    const completedFields = requiredFields.filter(field => {
      const value = values[field];
      return value && value !== '' && value !== 0;
    });
    
    const progress = (completedFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  };

  const onFinish = async (values: CourseFormData) => {
    console.log("Form values received:", values);
    
    // Validate all required fields before submitting
    if (!values.name || !values.description || !values.duration || !values.instructorId) {
      message.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    
    setLoading(true);
    try {
      const courseData = {
        name: values.name,
        description: values.description,
        price: {
          currency: values.price?.currency || Currency.VND,
          number: values.price?.number || 0
        },
        discount: {
          type: values.discount?.type || TypeDiscount.PERCENT,
          number: values.discount?.number || 0
        },
        instructorId: values.instructorId,
        category: values.category,
        cover: values.cover || "https://example.com/default-course-image.jpg",
        students: values.students || [],
        duration: values.duration,
        status: values.status || Status.ACTIVE
      };

      console.log("Data to be sent:", courseData);
      
      await dispatch(createCourse(courseData));
      message.success("Tạo khóa học thành công!");
      navigate("/course");
    } catch (error) {
      console.error("Error creating course:", error);
      message.error("Có lỗi xảy ra khi tạo khóa học");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionLayout title="Tạo khóa học mới">
      <div style={{ margin: "40px 0" }}>
        <ReturnPage dir="center" />
        
        <Row justify="center">
          <Col xs={24} sm={20} md={18} lg={16} xl={14}>
            <Card 
              className="create-course-card"
              style={{ 
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "none"
              }}
            >
              <div style={{ marginBottom: "32px", textAlign: "center" }}>
                <Title level={2} style={{ color: COLORS.primary[600], marginBottom: "8px" }}>
                  <PlusOutlined /> Tạo khóa học mới
                </Title>
                <Paragraph style={{ fontSize: "16px", color: COLORS.text.secondary }}>
                  Điền thông tin để tạo khóa học chuyên nghiệp
                </Paragraph>
                
                <div style={{ margin: "24px 0" }}>
                  <Text style={{ marginBottom: "8px", display: "block" }}>
                    Tiến độ hoàn thành: {Math.round(formProgress)}%
                  </Text>
                  <Progress 
                    percent={formProgress} 
                    showInfo={false}
                    strokeColor={{
                      '0%': COLORS.primary[400],
                      '100%': COLORS.primary[600],
                    }}
                  />
                </div>
              </div>

              <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish}
                onValuesChange={handleFormChange}
                size="large"
                className="create-course-form"
              >
                {/* Thông tin cơ bản */}
                <Card 
                  title={
                    <Space>
                      <BookOutlined />
                      <span>Thông tin cơ bản</span>
                    </Space>
                  } 
                  className="form-step-card"
                  style={{ marginBottom: "24px" }}
                >
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong><span style={{color: '#ff4d4f'}}>*</span> Tên khóa học</Text>} 
                        name="name" 
                        rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
                      >
                        <Input 
                          size="large"
                          placeholder="Nhập tên khóa học..." 
                          prefix={<BookOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong><span style={{color: '#ff4d4f'}}>*</span> Mô tả khóa học</Text>} 
                        name="description" 
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                      >
                        <TextArea 
                          rows={6} 
                          placeholder="Mô tả chi tiết về khóa học..."
                          showCount={false}
                          style={{ resize: 'vertical' }}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item 
                        label={<Text strong><span style={{color: '#ff4d4f'}}>*</span> Danh mục</Text>} 
                        name="category"
                        rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
                      >
                        <Input 
                          size="large"
                          placeholder="Ví dụ: Lập trình, Thiết kế..." 
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item 
                        label={<Text strong><span style={{color: '#ff4d4f'}}>*</span> Thời lượng (buổi học)</Text>} 
                        name="duration" 
                        rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
                      >
                        <InputNumber 
                          size="large"
                          min={1} 
                          max={100}
                          style={{ width: '100%' }}
                          placeholder="Số buổi học"
                          prefix={<ClockCircleOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Ảnh bìa khóa học</Text>} 
                        name="cover"
                      >
                        <Input 
                          size="large"
                          placeholder="URL ảnh bìa hoặc để trống sử dụng ảnh mặc định" 
                          prefix={<PictureOutlined />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* Giá cả & Trạng thái */}
                <Card 
                  title={
                    <Space>
                      <DollarOutlined />
                      <span>Giá cả & Trạng thái</span>
                    </Space>
                  } 
                  className="form-step-card"
                  style={{ marginBottom: "24px" }}
                >
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Form.Item label={<Text strong>Giá khóa học</Text>}>
                        <Input.Group compact>
                          <Form.Item 
                            name={["price", "number"]} 
                            noStyle
                            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                          >
                            <InputNumber 
                              size="large"
                              min={0} 
                              style={{ width: "75%" }} 
                              placeholder="Nhập giá khóa học"
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                          </Form.Item>
                          <Form.Item name={["price", "currency"]} noStyle initialValue={Currency.VND}>
                            <Select size="large" style={{ width: "25%" }}>
                              <Option value={Currency.VND}>VND</Option>
                              <Option value={Currency.USD}>USD</Option>
                            </Select>
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label={<Text strong>Giảm giá (tùy chọn)</Text>}>
                        <Input.Group compact>
                          <Form.Item name={["discount", "number"]} noStyle>
                            <InputNumber 
                              size="large"
                              min={0} 
                              style={{ width: "75%" }} 
                              placeholder="Giá trị giảm giá"
                            />
                          </Form.Item>
                          <Form.Item name={["discount", "type"]} noStyle initialValue={TypeDiscount.PERCENT}>
                            <Select size="large" style={{ width: "25%" }}>
                              <Option value={TypeDiscount.PERCENT}>
                                <Space>
                                  <PercentageOutlined />
                                  %
                                </Space>
                              </Option>
                              <Option value={TypeDiscount.VALUE}>
                                <Space>
                                  <DollarOutlined />
                                  VND
                                </Space>
                              </Option>
                            </Select>
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Trạng thái khóa học</Text>} 
                        name="status" 
                        initialValue={Status.ACTIVE}
                      >
                        <Select size="large">
                          <Option value={Status.ACTIVE}>
                            <Tag color="green">Hoạt động</Tag>
                          </Option>
                          <Option value={Status.INACTIVE}>
                            <Tag color="red">Tạm dừng</Tag>
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* Người tham gia */}
                <Card 
                  title={
                    <Space>
                      <UserOutlined />
                      <span>Người tham gia</span>
                    </Space>
                  } 
                  className="form-step-card"
                  style={{ marginBottom: "24px" }}
                >
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong><span style={{color: '#ff4d4f'}}>*</span> Giảng viên</Text>} 
                        name="instructorId"
                        rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="Chọn giảng viên cho khóa học"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={optionsTeachers}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Học viên (tùy chọn)</Text>} 
                        name="students"
                      >
                        <CustomSelectMultiple
                          placeholder="Chọn học viên tham gia khóa học"
                          options={optionsStudents}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Divider />

                <Row justify="center">
                  <Col>
                    <Space size="large">
                      <Button 
                        size="large" 
                        onClick={() => navigate('/course')}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        icon={<SaveOutlined />}
                      >
                        Tạo khóa học
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </SectionLayout>
  );
};

export default CreateCourse;
