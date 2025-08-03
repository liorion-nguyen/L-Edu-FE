import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Card,
  Typography,
  Space,
  Divider,
  Tag,
  Progress,
  message
} from "antd";
import {
  SaveOutlined,
  EditOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  PercentageOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CustomSelectMultiple from "../../../components/common/CustomSelectMultiple";
import ReturnPage from "../../../components/common/ReturnPage";
import { Currency, Status, TypeDiscount } from "../../../enum/course.enum";
import { Role } from "../../../enum/user.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourseById, getUsersCore, updateCourse } from "../../../redux/slices/courses";
import { RootState, useDispatch } from "../../../redux/store";
import { COLORS } from "../../../constants/colors";
import './UpdateCourse.css';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type OptionsType = {
  label: string;
  value: string;
};

const UpdateCourse: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course, loading } = useSelector((state: RootState) => state.courses);
  
  const [optionsStudents, setOptionsStudents] = useState<OptionsType[]>([]);
  const [optionsTeachers, setOptionsTeachers] = useState<OptionsType[]>([]);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        price: {
          currency: course.price?.currency || Currency.VND,
          number: course.price?.number || 0,
        },
        discount: {
          type: course.discount?.type || TypeDiscount.PERCENT,
          number: course.discount?.number || 0,
        },
        category: course.category || "",
        cover: course.cover || "",
        duration: course.duration || 0,
        status: course.status || Status.ACTIVE,
        instructorId: course.instructorId,
        students: course.students || [],
      });
      calculateProgress();
    }
  }, [course, form]);

  const calculateProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = ['name', 'description', 'duration', 'instructorId'];
    const completedFields = requiredFields.filter(field => {
      const value = values[field];
      return value && value !== '' && value !== 0;
    });
    
    const progress = (completedFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateCourse({ id: id as string, course: values }));
      message.success("Cập nhật khóa học thành công!");
      navigate("/course");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật khóa học");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id, dispatch]);

  const fetchData = async () => {
    try {
      dispatch(getCourseById(id as string));
      
      const [studentsResult, teachersResult] = await Promise.all([
        dispatch(getUsersCore(Role.STUDENT)),
        dispatch(getUsersCore(Role.TEACHER))
      ]);

      if (getUsersCore.fulfilled.match(studentsResult) && getUsersCore.fulfilled.match(teachersResult)) {
        const students = studentsResult.payload;
        const teachers = teachersResult.payload;

        if (students) {
          const uniqueOptionsStudent = students.map((item: any) => ({
            label: `${item.fullName} (${item.email})`,
            value: item._id
          }));
          setOptionsStudents(uniqueOptionsStudent);
        }

        if (teachers) {
          const uniqueOptionsTeacher = teachers.map((item: any) => ({
            label: `${item.fullName} (${item.email})`,
            value: item._id
          }));
          setOptionsTeachers(uniqueOptionsTeacher);
        }
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu khóa học");
    }
  };

  if (!course && !loading) {
    return (
      <SectionLayout title="Khóa học không tồn tại">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Title level={3}>Khóa học không tồn tại</Title>
          <Button type="primary" onClick={() => navigate('/course')}>
            Quay lại danh sách khóa học
          </Button>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout title="Cập nhật khóa học">
      <div style={{ margin: "40px 0" }}>
        <ReturnPage dir="center" />
        
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={14} xl={12}>
            <Card 
              className="update-course-card"
              style={{ 
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "none"
              }}
              loading={loading}
            >
              <div style={{ marginBottom: "32px", textAlign: "center" }}>
                <Title level={2} style={{ color: COLORS.primary[600], marginBottom: "8px" }}>
                  <EditOutlined /> Cập nhật khóa học
                </Title>
                <Paragraph style={{ fontSize: "16px", color: COLORS.text.secondary }}>
                  Chỉnh sửa thông tin khóa học "{course?.name}"
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
                onValuesChange={calculateProgress}
                size="large"
                className="update-course-form"
              >
                {/* Thông tin cơ bản */}
                <Card 
                  title={
                    <Space>
                      <BookOutlined />
                      <span>Thông tin cơ bản</span>
                    </Space>
                  } 
                  className="form-section-card"
                  style={{ marginBottom: "24px" }}
                >
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Tên khóa học</Text>} 
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
                        label={<Text strong>Mô tả khóa học</Text>} 
                        name="description" 
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                      >
                        <TextArea 
                          rows={4} 
                          placeholder="Mô tả chi tiết về khóa học..."
                          showCount
                          maxLength={500}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item 
                        label={<Text strong>Danh mục</Text>} 
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
                        label={<Text strong>Thời lượng (buổi học)</Text>} 
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
                  className="form-section-card"
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
                          <Form.Item name={["price", "currency"]} noStyle>
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
                          <Form.Item name={["discount", "type"]} noStyle>
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
                  className="form-section-card"
                  style={{ marginBottom: "24px" }}
                >
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Giảng viên</Text>} 
                        name="instructorId"
                        rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
                      >
                        {optionsTeachers.length > 0 && (
                          <Select
                            size="large"
                            showSearch
                            placeholder="Chọn giảng viên cho khóa học"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={optionsTeachers}
                          />
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item 
                        label={<Text strong>Học viên</Text>} 
                        name="students"
                      >
                        {optionsStudents.length > 0 && (
                          <CustomSelectMultiple
                            placeholder="Chọn học viên tham gia khóa học"
                            options={optionsStudents}
                            defaultValue={course?.students}
                          />
                        )}
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
                        loading={isSubmitting}
                        size="large"
                        icon={<SaveOutlined />}
                      >
                        Cập nhật khóa học
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

export default UpdateCourse;
