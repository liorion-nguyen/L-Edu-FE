import { Avatar, Button, Col, Flex, Image, Modal, Row, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { CreateChatRoomType, MessagesBoxType, MessageType } from "../../types/message";
import { DeleteOutlined, FileAddOutlined, SendOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { dispatch, RootState, useSelector } from "../../redux/store";
import Message from "./Message";
import TextArea from "antd/es/input/TextArea";
import { addMessageRealTime, createMessage, getMessageBoxById, updateChatRoom } from "../../redux/slices/messages";
import UpdateChatRoom from "./UpdateChatRoom";
import { Role } from "../../enum/user.enum";
import { pusher } from "../../config/pusher";

const ChatRoom = ({ messageBox }: { messageBox: MessagesBoxType }) => {
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleChangeText = (e: any) => {
    setMessage(e.target.value);
  };

  const handleEnterPress = (e: any) => {
    if (!e.shiftKey && !isSending) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if ((!file && !message.trim()) || isSending) return;
    setIsSending(true);
    try {
      await dispatch(
        createMessage(
          {
            chatRoomId: messageBox._id,
            message,
          },
          file
        )
      );

      setMessage("");
      setFile(null);
      setPreviewUrl(null);
      setFileType("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
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
    if (page < 0) return;

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

  const handleUpdateChatRoom = (data: CreateChatRoomType) => {
    dispatch(updateChatRoom(messageBox._id, { name: data.name, membersId: data.membersId, type: data.type }));
    setModal2Open(false);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);

      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else if (selectedFile.type.startsWith("video/")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!messageBox._id) return;

    const channelName = `chat-room-${messageBox._id}`;
    console.log('Subscribing to channel:', channelName); // Log kênh đăng ký

    const channel = pusher.subscribe(channelName);

    channel.bind('new-message', (message: MessageType) => {
      console.log('New message received:', message); // Log tin nhắn nhận được
      let req = {}
      if (message.file) {
        req = { ...req, file: message.file };
      }
      if (message.message) {
        req = { ...req, message: message.message };
      }
      dispatch(addMessageRealTime({
        ...req,
        _id: message._id,
        chatRoomId: message.chatRoomId,
        senderId: message.senderId
      }));
    });

    return () => {
      console.log('Unsubscribing from channel:', channelName); // Log khi hủy đăng ký
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messageBox._id]);


  return (
    <Flex vertical style={styles.chatRoom}>
      {/* Header */}
      <Row align="middle" gutter={[10, 10]} style={styles.chatRoomHeader}>
        <Col>
          <Avatar style={styles.avatar} onClick={() => setModal2Open(user?.role === Role.ADMIN)}>
            {messageBox.name}
          </Avatar>
          <Modal
            title={<span style={styles.modalTitle}>Update Chat Room</span>}
            centered
            open={modal2Open}
            onOk={() => setModal2Open(false)}
            onCancel={() => setModal2Open(false)}
            footer={[]}
            bodyStyle={styles.modalBody}
            style={styles.modal}
          >
            <UpdateChatRoom onSubmit={handleUpdateChatRoom} id={messageBox._id} />
          </Modal>
        </Col>
        <Col>
          <Title level={3} style={styles.title}>
            {messageBox.name}
          </Title>
        </Col>
      </Row>

      <div ref={chatContainerRef} style={styles.chatRoomBody} onScroll={handleScroll}>
        {page > 0 && loading && (
          <div style={styles.loading}>Loading...</div>
        )}
        <Flex style={{ flex: 1 }} vertical gap={10}>
          {messageBox.messages &&
            messageBox.messages.map((msg: MessageType, index) => (
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
        <Col style={{ maxWidth: 100 }}>
          <Flex vertical gap={10}>
            {file && (
              <div style={styles.filePreview}>
                {fileType.startsWith("image/") && (
                  <img src={previewUrl!} width={50} height={50} alt="preview" style={styles.previewImage} />
                )}
                {fileType.startsWith("video/") && (
                  <video width={50} height={50} controls style={styles.previewVideo}>
                    <source src={previewUrl!} type={fileType} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {!fileType.startsWith("image/") && !fileType.startsWith("video/") && (
                  <div style={styles.filePlaceholder}>
                    📄 {file.name}
                  </div>
                )}
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={handleDeleteFile}
                  style={styles.deleteButton}
                />
              </div>
            )}
            <Tooltip title="Upload File">
              <Button
                shape="circle"
                icon={<FileAddOutlined style={{ color: "#B0E0E6" }} />}
                onClick={handleButtonClick}
                style={styles.uploadButton}
              />
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Flex>
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
          <Button
            shape="circle"
            icon={<SendOutlined style={{ color: "#B0E0E6" }} />}
            onClick={sendMessage}
            style={styles.sendButton}
          />
        </Col>
      </Row>
    </Flex>
  );
};

export default ChatRoom;

const styles: {
  chatRoom: CSSProperties;
  chatRoomHeader: CSSProperties;
  chatRoomBody: CSSProperties;
  chatRoomFooter: CSSProperties;
  title: CSSProperties;
  input: CSSProperties;
  avatar: CSSProperties;
  modal: CSSProperties;
  modalTitle: CSSProperties;
  modalBody: CSSProperties;
  loading: CSSProperties;
  filePreview: CSSProperties;
  previewImage: CSSProperties;
  previewVideo: CSSProperties;
  filePlaceholder: CSSProperties;
  deleteButton: CSSProperties;
  uploadButton: CSSProperties;
  sendButton: CSSProperties;
} = {
  chatRoom: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chatRoomHeader: {
    padding: 10,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  chatRoomBody: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 0",
  },
  chatRoomFooter: {
    padding: 10,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  title: {
    margin: 0,
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  input: {
    maxHeight: 200,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    color: "#B0E0E6", // Pale teal for text
    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  avatar: {
    backgroundColor: "#4ECDC4", // Brighter teal for avatar
    color: "#0A2E2E", // Dark teal for text
    cursor: "pointer",
  },
  modal: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
  },
  modalTitle: {
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  modalBody: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  loading: {
    textAlign: "center",
    padding: "10px",
    color: "#B0E0E6", // Pale teal for text
  },
  filePreview: {
    marginTop: 10,
    position: "relative",
    display: "inline-block",
  },
  previewImage: {
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  previewVideo: {
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  filePlaceholder: {
    padding: "10px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    borderRadius: "5px",
    color: "#B0E0E6", // Pale teal for text
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  uploadButton: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  sendButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
};

// Add hover effects using CSS
const styleSheetChatRoom = document.createElement("style");
styleSheetChatRoom.innerText = `
  .upload-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .send-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetChatRoom);