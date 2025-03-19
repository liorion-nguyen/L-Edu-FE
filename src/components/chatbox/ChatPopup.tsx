import { CSSProperties, useEffect, useState } from "react";
import { Button, Drawer, Flex } from "antd";
import { MessageOutlined, RollbackOutlined } from "@ant-design/icons";
import MessagesBox from "./MessagesBox";
import { RootState, useSelector } from "../../redux/store";
import ChatRoom from "./ChatRoom";

const ChatPopup = () => {
  const [visible, setVisible] = useState(false);
  const toggleChat = () => setVisible(!visible);
  const { messageBox } = useSelector((state: RootState) => state.messages);
  const [isChatRoom, setIsChatRoom] = useState(true);

  useEffect(() => {
    if (messageBox) {
      setIsChatRoom(true);
    }
  }, [messageBox]);

  return (
    <div>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined style={{ fontSize: "24px", color: "#B0E0E6" }} />}
        onClick={toggleChat}
        style={styles.chatButton}
      />
      <Drawer
        title={<span style={styles.drawerTitle}>Đoạn Chat</span>}
        placement="right"
        onClose={toggleChat}
        open={visible}
        bodyStyle={styles.drawerBody}
        headerStyle={styles.drawerHeader}
      >
        {messageBox && isChatRoom ? (
          <Flex vertical style={{ height: "100%" }}>
            <Button
              type="primary"
              icon={<RollbackOutlined />}
              style={styles.backButton}
              onClick={() => setIsChatRoom(false)}
            >
              Back to chat list
            </Button>
            <Flex style={{ flex: 1, minHeight: 0 }}>
              <ChatRoom messageBox={messageBox} />
            </Flex>
          </Flex>
        ) : (
          <MessagesBox />
        )}
      </Drawer>
    </div>
  );
};

export default ChatPopup;

const styles: {
  chatButton: CSSProperties;
  drawerTitle: CSSProperties;
  drawerBody: CSSProperties;
  drawerHeader: CSSProperties;
  backButton: CSSProperties;
} = {
  chatButton: {
    position: "fixed",
    bottom: 100,
    right: 30,
    zIndex: 1000,
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  drawerTitle: {
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  drawerBody: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  drawerHeader: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  backButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    color: "#B0E0E6", // Pale teal for text
    minHeight: 35,
    marginBottom: 10,
    transition: "box-shadow 0.3s",
  },
};

// Add hover effects using CSS
const styleSheetChatPopup = document.createElement("style");
styleSheetChatPopup.innerText = `
  .chat-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: scale(1.1);
  }
  .back-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetChatPopup);