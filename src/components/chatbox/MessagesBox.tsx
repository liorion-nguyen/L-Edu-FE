import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Empty, Flex, Input, List, Modal, Skeleton } from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import { createChatRoom, getMessageBoxById, getMessagesBox } from "../../redux/slices/messages";
import { dispatch, RootState, useSelector } from "../../redux/store";
import { CreateChatRoomType } from "../../types/message";
import { useIsAdmin } from "../../utils/auth";
import CreateChatRoom from "./CreateChatRoom";

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
      dispatch(getMessagesBox({}));
    }
  }, []);

  const handleSelectRoom = (roomId: string) => {
    dispatch(getMessageBoxById({ id: roomId }));
  };

  const [modal2Open, setModal2Open] = useState(false);

  const handleCreateRoom = (data: CreateChatRoomType) => {
    dispatch(createChatRoom(data));
    setModal2Open(false);
  };

  return (
    <Flex vertical style={styles.container}>
      <Flex style={{ position: "relative" }}>
        <Input.Search
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        {search && (
          <div style={styles.searchResults}>
            {loading ? (
              <Skeleton active />
            ) : dataSearch.length > 0 ? (
              dataSearch.map((user) => (
                <List.Item
                  key={user._id}
                  onClick={() => handleSelectRoom(user._id)}
                  style={styles.searchItem}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.avatar} />}
                    title={<span style={styles.searchItemText}>{user.fullName}</span>}
                  />
                </List.Item>
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <Button onClick={() => setSearch("")} block style={styles.closeButton}>
              Close
            </Button>
          </div>
        )}
      </Flex>

      {messagesBox && (
        <List
          itemLayout="horizontal"
          dataSource={messagesBox}
          style={styles.list}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              onClick={() => handleSelectRoom(item._id)}
              style={styles.listItem}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={styles.avatar}>
                    {item.name}
                  </Avatar>
                }
                title={<span style={styles.listItemText}>{item.name}</span>}
              />
            </List.Item>
          )}
        />
      )}
      {useIsAdmin() && (
        <Button
          type="primary"
          block
          icon={<EditOutlined />}
          style={styles.createButton}
          onClick={() => setModal2Open(true)}
        >
          Create Room Chat
        </Button>
      )}
      <Modal
        title={<span style={styles.modalTitle}>Create Chat Room</span>}
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={[]}
        bodyStyle={styles.modalBody}
        style={styles.modal}
      >
        <CreateChatRoom onSubmit={handleCreateRoom} />
      </Modal>
    </Flex>
  );
};

export default MessagesBox;

const styles: {
  container: CSSProperties;
  searchInput: CSSProperties;
  searchResults: CSSProperties;
  searchItem: CSSProperties;
  searchItemText: CSSProperties;
  closeButton: CSSProperties;
  list: CSSProperties;
  listItem: CSSProperties;
  listItemText: CSSProperties;
  avatar: CSSProperties;
  createButton: CSSProperties;
  modal: CSSProperties;
  modalTitle: CSSProperties;
  modalBody: CSSProperties;
} = {
  container: {
    height: "100%",
  },
  searchInput: {
    marginBottom: 16,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    color: "#B0E0E6", // Pale teal for text
  },
  searchResults: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    position: "absolute",
    zIndex: 1,
    width: "90%",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    padding: 10,
  },
  searchItem: {
    cursor: "pointer",
    padding: 10,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    borderRadius: 8,
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  searchItemText: {
    color: "#B0E0E6", // Pale teal for text
  },
  closeButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  list: {
    flex: 1,
    overflowY: "auto",
  },
  listItem: {
    cursor: "pointer",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    borderRadius: 8,
    padding: 10,
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    marginBottom: 10,
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  listItemText: {
    color: "#B0E0E6", // Pale teal for text
  },
  avatar: {
    backgroundColor: "#4ECDC4", // Brighter teal for avatar
    color: "#0A2E2E", // Dark teal for text
  },
  createButton: {
    marginTop: 16,
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
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
};

// Add hover effects using CSS
const styleSheetMessagesBox = document.createElement("style");
styleSheetMessagesBox.innerText = `
  .search-item:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-3px);
  }
  .list-item:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-3px);
  }
  .close-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .create-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetMessagesBox);