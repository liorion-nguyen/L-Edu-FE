import { Row, Col, Form, Input, Button, Select, Flex } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import { useParams } from "react-router-dom";
import { initialValuesType } from "../../../types/session";
import { dispatch } from "../../../redux/store";
import { createSession } from "../../../redux/slices/courses";
import ReturnPage from "../../../components/common/ReturnPage";

const { Option } = Select;

const AddSession = () => {
    const { id } = useParams(); // Lấy courseId từ URL
    const [form] = Form.useForm();

    // Xử lý khi submit form
    const onFinish = async (values: initialValuesType) => {
        await dispatch(createSession(values));
        form.resetFields();
    };
    return (
        <SectionLayout title="Thêm Buổi Học">
            <Row style={{ margin: "50px 0" }} gutter={[20, 20]} justify="center">
                <ReturnPage dir="center"/>
                <Col span={12}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            courseId: id,
                            sessionNumber: "",
                            title: "",
                            quizId: "",
                            modeQuizId: "CLOSE",
                            videoUrl: "",
                            modeVideoUrl: "CLOSE",
                            notesMd: "",
                            modeNoteMd: "CLOSE",
                            mode: "OPEN",
                        }}
                    >
                        <Form.Item label="Mã khóa học" name="courseId">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label="Số buổi" name="sessionNumber" rules={[{ required: true, message: "Vui lòng nhập số buổi!" }]}>
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                            <Input />
                        </Form.Item>

                        <Flex justify="space-between" align="middle" gap={10}>
                            <Form.Item label="Mã Quiz" name="quizId" style={{ flex: 1 }}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Trạng thái Quiz" name="modeQuizId">
                                <Select>
                                    <Option value="OPEN">OPEN</Option>
                                    <Option value="CLOSE">CLOSE</Option>
                                </Select>
                            </Form.Item>
                        </Flex>

                        <Flex justify="space-between" align="middle" gap={10}>
                            <Form.Item label="URL Video" name="videoUrl" style={{ flex: 1 }}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Trạng thái Video" name="modeVideoUrl">
                                <Select>
                                    <Option value="OPEN">OPEN</Option>
                                    <Option value="CLOSE">CLOSE</Option>
                                </Select>
                            </Form.Item>
                        </Flex>

                        <Flex justify="space-between" align="middle" gap={10}>
                            <Form.Item label="Ghi chú (Markdown)" name="notesMd" style={{ flex: 1 }}>
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item label="Trạng thái Ghi chú" name="modeNoteMd">
                                <Select>
                                    <Option value="OPEN">OPEN</Option>
                                    <Option value="CLOSE">CLOSE</Option>
                                </Select>
                            </Form.Item>
                        </Flex>

                        <Form.Item label="Trạng thái buổi học" name="mode">
                            <Select>
                                <Option value="OPEN">OPEN</Option>
                                <Option value="CLOSE">CLOSE</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit">
                                Thêm Buổi Học
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default AddSession;