import { Avatar, Button, Col, Flex, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { MessagesBoxType, MessageType } from "../../types/message";
import { FileAddOutlined, SendOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { dispatch, RootState, useSelector } from "../../redux/store";
import Message from "./Message";
import TextArea from "antd/es/input/TextArea";
import { createMessage } from "../../redux/slices/messages";

const ChatRoom = ({ messageBox }: { messageBox: MessagesBoxType }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState<string>("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handleChangeText = (e: any) => {
        setMessage(e.target.value);
    };

    const handleEnterPress = (e: any) => {
        if (!e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            await dispatch(createMessage({
                message: message,
                chatRoomId: messageBox._id
            }));
            console.log("Sent message:", message);
            setMessage("");
        }
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageBox.messages]);

    return (
        <Flex vertical style={styles.chatRoom}>
            {/* Header */}
            <Row align="middle" gutter={[10, 10]} style={styles.chatRoomHeader}>
                <Col>
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{messageBox.name}</Avatar>
                </Col>
                <Col>
                    <Title level={3} style={styles.title}>{messageBox.name}</Title>
                </Col>
            </Row>

            {/* Chat messages (scrollable) */}
            <Flex style={styles.chatRoomBody} vertical gap={10}>
                {
                    messageBox.messages && messageBox.messages.map((msg: MessageType, index) => (
                        <Row key={index} style={{ width: "100%" }}>
                            <Message
                                message={msg.message}
                                file={msg.file || null}
                                isSender={msg.senderId && msg.senderId._id === user?._id ? null : msg.senderId || null}
                            />
                        </Row>
                    ))
                }
                <div ref={chatEndRef}></div>
            </Flex>

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
    chatRoomFooter: CSSProperties
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
    }
};
