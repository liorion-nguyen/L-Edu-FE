import { Avatar, Button, Col, Flex, Modal, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { MessagesBoxType, MessageType } from "../../types/message";
import { FileAddOutlined, SendOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { dispatch, RootState, useSelector } from "../../redux/store";
import Message from "./Message";
import TextArea from "antd/es/input/TextArea";
import { createMessage, getMessageBoxById, getMessagesBox } from "../../redux/slices/messages";
import UpdateChatRoom from "./UpdateChatRoom";

const ChatRoom = ({ messageBox }: { messageBox: MessagesBoxType }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const handleChangeText = (e: any) => {
        setMessage(e.target.value);
    };

    const handleEnterPress = (e: any) => {
        if (!e.shiftKey && !isSending) { // Chặn gửi nếu đang gửi tin nhắn trước đó
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || isSending) return; // Ngăn gửi nếu đang gửi

        setIsSending(true); // Đánh dấu đang gửi tin nhắn

        try {
            await dispatch(createMessage({
                message: message,
                chatRoomId: messageBox._id
            }));
            setMessage(""); // Xóa nội dung sau khi gửi thành công
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false); // Cho phép gửi tiếp
        }
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop } = chatContainerRef.current;

        if (scrollTop === 0 && !loading) {
            setLoading(true);
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        if (page < 0) return; // ✅ Dừng useEffect khi page === -1

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const results = await dispatch(getMessageBoxById(messageBox._id, page, 10));
                if (!results || results.length === 0) {
                    setPage(-1);
                }
            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.log("Request bị hủy.");
                } else {
                    console.error("Lỗi fetch tin nhắn:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (page > 0) fetchMessages();
    }, [page]);

    const [modal2Open, setModal2Open] = useState(false);

    const handleUpdateChatRoom = (data: any) => {
        // dispatch(createChatRoom({ name: data.name, membersId: data.membersId, type: data.type }));
        setModal2Open(false);
    };
    
    return (
        <Flex vertical style={styles.chatRoom}>
            {/* Header */}
            <Row align="middle" gutter={[10, 10]} style={styles.chatRoomHeader}>
                <Col>
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} onClick={() => setModal2Open(true)}>{messageBox.name}</Avatar>
                    <Modal
                        title="Update Chat Room"
                        centered
                        visible={modal2Open}
                        onOk={() => setModal2Open(false)}
                        onCancel={() => setModal2Open(false)}
                        footer={[
                        ]}
                    >
                        <UpdateChatRoom onSubmit={handleUpdateChatRoom} id={messageBox._id} />
                    </Modal>
                </Col>
                <Col>
                    <Title level={3} style={styles.title}>{messageBox.name}</Title>
                </Col>
            </Row>

            <div
                ref={chatContainerRef}
                style={{ overflowY: "scroll", flex: 1 }}
                onScroll={handleScroll}
            >
                {page > 0 && loading && <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>}

                <Flex style={styles.chatRoomBody} vertical gap={10}>
                    {messageBox.messages && messageBox.messages.map((msg: MessageType, index) => (
                        <Row key={index} style={{ width: "100%" }}>
                            <Message
                                message={msg.message}
                                file={msg.file || null}
                                isSender={msg.senderId && msg.senderId._id === user?._id ? null : msg.senderId || null}
                            />
                        </Row>
                    ))}
                    <div ref={chatEndRef}></div>
                </Flex>
            </div>

            {/* Footer Input */}
            <Row align="middle" gutter={[10, 10]} style={styles.chatRoomFooter}>
                <Col>
                    <Tooltip title="Upload File">
                        <Button shape="circle" icon={<FileAddOutlined style={{ color: "black" }} />} />
                    </Tooltip>
                </Col>
                <Col style={{ flex: 1 }}>
                    <TextArea
                        placeholder="Enter message content"
                        autoSize
                        value={message}
                        onChange={handleChangeText}
                        onPressEnter={handleEnterPress}
                        style={styles.input}
                    />
                </Col>
                <Col>
                    <Button shape="circle" icon={<SendOutlined style={{ color: "black" }} />} onClick={sendMessage} />
                </Col>
            </Row>
        </Flex>
    );
};
export default ChatRoom;

const styles: {
    title: CSSProperties,
    chatRoom: CSSProperties,
    chatRoomHeader: CSSProperties,
    chatRoomBody: CSSProperties,
    chatRoomFooter: CSSProperties,
    input: CSSProperties
} = {
    chatRoom: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    chatRoomHeader: {
        padding: 10,
        borderBottom: "1px solid #f0f0f0",
        background: "#f0f0f0",
    },
    chatRoomBody: {
        flex: 1,
        overflowY: "auto",
        padding: "10px 0"
    },
    chatRoomFooter: {
        padding: 10,
        borderTop: "1px solid #f0f0f0",
        background: "#f0f0f0",
    },
    title: {
        margin: 0
    },
    input: {
        maxHeight: 200,
    }
};
