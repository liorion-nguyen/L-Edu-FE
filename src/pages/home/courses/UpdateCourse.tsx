import { useEffect, useState } from "react";
import { Row, Col, Form, Input, Button, Select, InputNumber } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import { useParams } from "react-router-dom";
import { dispatch, RootState } from "../../../redux/store";
import { getCourseById, getUsersCore, updateCourse } from "../../../redux/slices/courses";
import { useSelector } from "react-redux";
import { Currency, Status, TypeDiscount } from "../../../enum/course.enum";
import CustomSelectMultiple from "../../../components/common/CustomSelectMultiple";
import { Role } from "../../../enum/user.enum";
import ReturnPage from "../../../components/common/ReturnPage";

const { Option } = Select;

type OptionsType = {
    label: string;
    value: string;
}

const UpdateCourse = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const { course } = useSelector((state: RootState) => state.courses);
    const [optionsStudents, setOptionsStudents] = useState<OptionsType[]>([]);
    const [optionsTeachers, setOptionsTeachers] = useState<OptionsType[]>([]);

    useEffect(() => {
        if (course) {
            form.setFieldsValue({
                name: course.name,
                description: course.description,
                price: {
                    currency: course.price?.currency || Currency.USD,
                    number: course.price?.number || 0,
                },
                discount: {
                    type: course.discount?.type || TypeDiscount.PERCENT,
                    number: course.discount?.number || 0,
                },
                category: course.category || "",
                cover: course.cover || null,
                duration: course.duration || 0,
                status: course.status || Status.ACTIVE,
            });
        }
    }, [course]);

    // Xử lý khi submit form
    const onFinish = async (values: any) => {
        await dispatch(updateCourse(id as string, values));
    };

    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const fetchData = async () => {
        dispatch(getCourseById(id as string));
        const students = await dispatch(getUsersCore(Role.STUDENT));
        const teachers = await dispatch(getUsersCore(Role.TEACHER));
        if (!teachers || !students) return;

        const uniqueOptionsStudent = students.map((item: any) => ({
            label: `${item.fullName} [${item.email}]`,
            value: item._id
        }));

        const uniqueOptionsTeacher = teachers.map((item: any) => ({
            label: `${item.fullName} [${item.email}]`,
            value: item._id
        }));

        setOptionsStudents(uniqueOptionsStudent);
        setOptionsTeachers(uniqueOptionsTeacher);
    };
    return (
        <SectionLayout title="Cập Nhật Khóa Học">
            <Row style={{ margin: "50px 0" }} gutter={[20, 20]} justify="center">
                <ReturnPage dir="center"/>
                <Col span={12}>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Tên khóa học" name="name" rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item label="Danh mục" name="category">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Ảnh bìa (URL)" name="cover">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời lượng (Buổi)" name="duration" rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}>
                            <InputNumber min={1} />
                        </Form.Item>

                        {/* Giá khóa học */}
                        <Form.Item label="Giá khóa học">
                            <Input.Group compact>
                                <Form.Item name={["price", "number"]} noStyle>
                                    <InputNumber min={0} style={{ width: "70%" }} placeholder="Giá" />
                                </Form.Item>
                                <Form.Item name={["price", "currency"]} noStyle>
                                    <Select style={{ width: "30%" }}>
                                        <Option value={Currency.USD}>USD</Option>
                                        <Option value={Currency.VND}>VND</Option>
                                    </Select>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>

                        {/* Giảm giá */}
                        <Form.Item label="Giảm giá">
                            <Input.Group compact>
                                <Form.Item name={["discount", "number"]} noStyle>
                                    <InputNumber min={0} style={{ width: "70%" }} placeholder="Giá trị giảm" />
                                </Form.Item>
                                <Form.Item name={["discount", "type"]} noStyle>
                                    <Select style={{ width: "30%" }}>
                                        <Option value={TypeDiscount.PERCENT}>%</Option>
                                        <Option value={TypeDiscount.VALUE}>Số tiền</Option>
                                    </Select>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>

                        <Form.Item label="Trạng thái" name="status">
                            <Select>
                                <Option value={Status.ACTIVE}>Hoạt động</Option>
                                <Option value={Status.INACTIVE}>Ngừng hoạt động</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Học viên" name="students">
                            {
                                optionsStudents.length != 0 && course &&
                                <CustomSelectMultiple
                                    placeholder="Choose Students"
                                    options={optionsStudents}
                                    defaultValue={course?.students}
                                />
                            }
                        </Form.Item>

                        <Form.Item label="Giáo viên" name="instructorId">
                            {
                                optionsTeachers.length != 0 && course &&
                                <Select
                                    showSearch
                                    placeholder="Select A Teacher"
                                    defaultValue={course?.instructorId}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={optionsTeachers}
                                />
                            }
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit">
                                Cập Nhật Khóa Học
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default UpdateCourse;