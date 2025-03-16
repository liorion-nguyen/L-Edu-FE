import { useEffect, useState } from "react";
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
        icon={<MessageOutlined style={{ fontSize: "24px" }} />}
        onClick={toggleChat}
        style={{ position: "fixed", bottom: 100, right: 30, zIndex: 1000 }}
      />
      <Drawer
        title="Đoạn Chat"
        placement="right"
        onClose={toggleChat}
        open={visible}
      >
        {
          messageBox && isChatRoom ? (
            <Flex vertical style={{ height: "100%" }}>
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                style={{ minHeight: 35 }}
                onClick={() => setIsChatRoom(false)}
              >
                Back to chat list
              </Button>
              <Flex style={{ flex: 1, minHeight: 0 }}>
                <ChatRoom messageBox={messageBox} />
              </Flex>
            </Flex>
          ) : <MessagesBox />
        }
      </Drawer>
    </div>
  );
};

export default ChatPopup;
