import { Button, Col, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { Role } from "../../enum/user.enum";
import { getUsersCore } from "../../redux/slices/courses";
import { dispatch } from "../../redux/store";
import { CreateChatRoomType, TypeChatRoom } from "../../types/message";
import { UserCoreType } from "../../types/user";
import CustomSelectMultiple from "../common/CustomSelectMultiple";

const { Option } = Select;
type OptionsType = {
    label: string;
    value: string;
}

const CreateChatRoom = ({ onSubmit }: { onSubmit: (data: CreateChatRoomType) => void }) => {
    const [form] = Form.useForm();
    const handleFinish = (values: CreateChatRoomType) => {
        onSubmit(values);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [optionsUser, setOptionsuUers] = useState<OptionsType[]>([]);

    const fetchData = async () => {
        const studentsResult = await dispatch(getUsersCore(Role.STUDENT));
        const teachersResult = await dispatch(getUsersCore(Role.TEACHER));
        
        if (getUsersCore.fulfilled.match(studentsResult) && getUsersCore.fulfilled.match(teachersResult)) {
            const students = studentsResult.payload;
            const teachers = teachersResult.payload;
            
            if (!teachers || !students) return;

            const uniqueOptionsStudent = students.map((item: UserCoreType) => ({
                label: `${item.fullName} [${item.email}]`,
                value: item._id
            }));

            const uniqueOptionsTeacher = teachers.map((item: UserCoreType) => ({
                label: `${item.fullName} [${item.email}]`,
                value: item._id
            }));

            setOptionsuUers([...uniqueOptionsStudent, ...uniqueOptionsTeacher]);
        }
    };
    return (
        <Row style={{ marginTop: "20px" }} gutter={[20, 20]} justify="center">
            <Col span={24}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        name: "",
                        membersId: [],
                        typeChatRoom: TypeChatRoom.PRIVATE
                    }}
                >
                    <Form.Item label="Tên Chat Room" name="name" rules={[{ required: true, message: "Vui lòng nhập tên chat room!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Kiểu phòng chat" name="typeChatRoom">
                        <Select>
                            <Option value={TypeChatRoom.PRIVATE}>PRIVATE</Option>
                            <Option value={TypeChatRoom.GROUP}>GROUP</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Học viên" name="membersId">
                        {
                            optionsUser.length != 0 &&
                            <CustomSelectMultiple
                                placeholder="Choose Students"
                                options={optionsUser}
                            />
                        }
                    </Form.Item>


                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit">
                            Tạo Phòng Chat
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default CreateChatRoom;