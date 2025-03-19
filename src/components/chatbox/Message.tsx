import { Avatar, Col, Flex, Image, Row, Typography } from "antd";
import { UserCoreType } from "../../types/user";
import { initialsName } from "../../utils/logic";
import { FileType } from "../../types/message";
import { FileOutlined } from "@ant-design/icons";
import { TypeFileR } from "../../enum/message.enum";
import { CSSProperties } from "react";

const { Text } = Typography;

interface MessageProps {
  message?: string;
  file?: FileType | null;
  isSender: UserCoreType | null;
}

const Content = ({ message, isSender }: { message: string; isSender: UserCoreType | null }) => {
  return (
    <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
      <Text style={styles.contentText}>{message}</Text>
    </Flex>
  );
};

const Message = ({ message, file, isSender }: MessageProps) => {
  const getFileComponent = (fileR: FileType) => {
    const fileExtension = fileR.url.split(".").pop()?.toLowerCase();
    if (!fileR) return null;

    if (fileR.type === TypeFileR.IMAGE) {
      return (
        <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
          <Image src={fileR.url} width={150} style={styles.fileImage} />
        </Flex>
      );
    }

    if (fileR.type === TypeFileR.VIDEO) {
      return (
        <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
          <video width={250} controls style={styles.fileVideo}>
            <source src={fileR.url} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        </Flex>
      );
    }

    return (
      <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
        <a href={fileR.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
          <Flex align="center" gap={8}>
            <FileOutlined style={styles.fileIcon} />
            <Text style={styles.fileText}>Tải xuống file</Text>
          </Flex>
        </a>
      </Flex>
    );
  };

  return (
    <Col span={24}>
      <Row align="bottom" style={{ width: "100%" }}>
        <Col span={3}>
          {isSender && (
            <Avatar src={isSender.avatar} style={styles.avatar}>
              {initialsName(isSender.fullName)}
            </Avatar>
          )}
        </Col>
        <Col span={21}>
          <Flex vertical>
            {isSender && <Text style={styles.senderName}>{isSender.fullName}</Text>}
            {message && <Content message={message} isSender={isSender} />}
            {file && getFileComponent(file)}
          </Flex>
        </Col>
      </Row>
    </Col>
  );
};

export default Message;

const styles: {
  contentText: CSSProperties;
  avatar: CSSProperties;
  senderName: CSSProperties;
  fileImage: CSSProperties;
  fileVideo: CSSProperties;
  fileLink: CSSProperties;
  fileIcon: CSSProperties;
  fileText: CSSProperties;
} = {
  contentText: {
    padding: 10,
    borderRadius: 8,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    color: "#B0E0E6", // Pale teal for text
    maxWidth: 250,
    whiteSpace: "pre-wrap",
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  avatar: {
    backgroundColor: "#4ECDC4", // Brighter teal for avatar
    color: "#0A2E2E", // Dark teal for text
  },
  senderName: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "12px",
  },
  fileImage: {
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  fileVideo: {
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  fileLink: {
    padding: 10,
    borderRadius: 8,
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  fileIcon: {
    fontSize: 20,
    color: "#B0E0E6", // Pale teal for icon
  },
  fileText: {
    color: "#B0E0E6", // Pale teal for text
  },
};

// Add hover effects using CSS
const styleSheetMessage = document.createElement("style");
styleSheetMessage.innerText = `
  .content-text:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-3px);
  }
  .file-link:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-3px);
  }
`;
document.head.appendChild(styleSheetMessage);