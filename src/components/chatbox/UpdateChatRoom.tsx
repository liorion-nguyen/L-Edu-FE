import { Row, Col, Form, Input, Button, Select } from "antd";
import { CreateChatRoomType, TypeChatRoom } from "../../types/message";
import CustomSelectMultiple from "../common/CustomSelectMultiple";
import { useEffect, useState } from "react";
import { dispatch } from "../../redux/store";
import { getUsersCore } from "../../redux/slices/courses";
import { Role } from "../../enum/user.enum";
import { UserCoreType } from "../../types/user";
import { deleteChatRoom, getInformationChatRoom } from "../../redux/slices/messages";
import ChatRoom from "./ChatRoom";

const { Option } = Select;
type OptionsType = {
    label: string;
    value: string;
}

const UpdateChatRoom = ({ onSubmit, id }: { onSubmit: (data: CreateChatRoomType) => void, id: string }) => {
    const [form] = Form.useForm();
    const [chatRoom, setChatRoom] = useState<CreateChatRoomType>();
    const handleFinish = (values: CreateChatRoomType) => {
        onSubmit(values);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [optionsUser, setOptionsuUers] = useState<OptionsType[]>([]);

    const fetchData = async () => {
        const resChatRoom = await dispatch(getInformationChatRoom(id));
        console.log(resChatRoom);

        setChatRoom(resChatRoom);

        const students = await dispatch(getUsersCore(Role.STUDENT));
        const teachers = await dispatch(getUsersCore(Role.TEACHER));
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
    };

    const handleDelete = () => {
        dispatch(deleteChatRoom(id));
    };
    return (
        <Row style={{ marginTop: "20px" }} gutter={[20, 20]} justify="center">
            <Col span={24}>
                {
                    chatRoom &&
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{
                            name: chatRoom.name,
                            membersId: chatRoom.membersId,
                            typeChatRoom: chatRoom.type
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
                                    defaultValue={chatRoom.membersId}
                                />
                            }
                        </Form.Item>


                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" color="orange" onClick={handleDelete} style={{ marginRight: "20px" }}>
                                Xoá Phòng Chat
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập Nhật Phòng Chat
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Col>
        </Row>
    );
};

export default UpdateChatRoom;