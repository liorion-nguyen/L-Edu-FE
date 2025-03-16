import React, { useState, useEffect } from "react";
import { Input, List, Avatar, Button, Skeleton, Row, Col, Empty, Flex, Form, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { dispatch, RootState, useSelector } from "../../redux/store";
import { getMessageBoxById, getMessagesBox } from "../../redux/slices/messages";
import { useIsAdmin } from "../../utils/auth";
import CustomSelectMultiple from "../common/CustomSelectMultiple";

const MessagesBox: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const [dataSearch, setDataSearch] = useState<any[]>([]);

    useEffect(() => {
        if (search && messagesBox) {
            const filtered = messagesBox.filter((msg) =>
                msg.name.toLowerCase().includes(search.toLowerCase())
            );
            setDataSearch(filtered);
        } else {
            setDataSearch([]);
        }
    }, [search]);

    const { loading, messagesBox } = useSelector((state: RootState) => state.messages);
    useEffect(() => {
        if (!messagesBox) {
            dispatch(getMessagesBox());
        }
    }, []);

    const handleSelectRoom = (roomId: string) => {
        dispatch(getMessageBoxById(roomId));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // Lấy dữ liệu từ form
            console.log("Room Data:", values);
            setIsModalOpen(false);
            form.resetFields(); // Reset form sau khi đóng
        } catch (error) {
            console.error("Validation Failed:", error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Flex vertical style={{ height: "100%" }}>
            <Flex style={{ position: "relative" }}>
                <Input.Search
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: 16 }}
                />

                {search && (
                    <div style={{ background: "white", position: "absolute", zIndex: 1, width: "90%", borderRadius: 8, boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", padding: 10 }}>
                        {loading ? (
                            <Skeleton active />
                        ) : dataSearch.length > 0 ? (
                            dataSearch.map((user) => (
                                <List.Item key={user._id} onClick={() => handleSelectRoom(user._id)} style={{ cursor: "pointer", padding: 10 }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={user.avatar} />}
                                        title={user.fullName}
                                    />
                                </List.Item>
                            ))
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                        <Button onClick={() => setSearch("")} block>Close</Button>
                    </div>
                )}
            </Flex>

            {messagesBox && <List
                itemLayout="horizontal"
                dataSource={messagesBox}
                style={{ flex: 1, overflowY: "auto" }}
                renderItem={(item) => (
                    <List.Item
                        key={item._id}
                        onClick={() => handleSelectRoom(item._id)}
                        style={{
                            cursor: "pointer",
                            background: "#f0f0f0",
                            borderRadius: 8,
                            padding: 10,
                        }}
                    >
                        <List.Item.Meta avatar={<Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{item.name}</Avatar>} title={item.name} />
                    </List.Item>
                )}
            />}
            {useIsAdmin() && (
                <Button
                    type="primary"
                    block
                    icon={<EditOutlined />}
                    style={{ marginTop: 16 }}
                    onClick={showModal}
                >
                    Create Room Chat
                </Button>
            )}
        </Flex>
    );
};

export default MessagesBox;