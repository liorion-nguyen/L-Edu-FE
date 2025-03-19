import { Avatar, Col, Flex, Image, Row, Typography } from "antd";
import { UserCoreType } from "../../types/user";
import { initialsName } from "../../utils/logic";
import { FileType } from "../../types/message";
import { FileOutlined } from "@ant-design/icons";
import { TypeFileR } from "../../enum/message.enum";

const Text = Typography.Text;

interface MessageProps {
    message?: string,
    file?: FileType | null,
    isSender: UserCoreType | null
}

const Content = ({ message, isSender }: { message: string, isSender: UserCoreType | null }) => {
    return (
        <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
            <Text style={{ ...styles.conentText }}>{message}</Text>
        </Flex>
    );
}

const Message = ({ message, file, isSender }: MessageProps) => {
    const getFileComponent = (fileR: FileType) => {
        const fileExtension = fileR.url.split('.').pop()?.toLowerCase();
        if (!fileR) return null;

        if (fileR.type === TypeFileR.IMAGE) {
            return (
                <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
                    <Image src={fileR.url} width={150} />
                </Flex>
            )
        }

        if (fileR.type === TypeFileR.VIDEO) {
            return (
                <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
                    <video width={250} controls>
                        <source src={fileR.url} type={`video/${fileExtension}`} />
                        Your browser does not support the video tag.
                    </video>
                </Flex>
            );
        }

        return (
            <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
                <a href={fileR.url} target="_blank" rel="noopener noreferrer">
                    <Flex align="center" gap={8}>
                        <FileOutlined style={{ fontSize: 20 }} />
                        <Text type="secondary">Tải xuống file</Text>
                    </Flex>
                </a>
            </Flex>
        );
    };
    return (
        <Col span={24}>
            <Row align="bottom" style={{ width: "100%" }}>
                <Col span={3}>
                    {isSender && <Avatar src={isSender.avatar}>{initialsName(isSender.fullName)}</Avatar>}
                </Col>
                <Col span={21}>
                    <Flex vertical>
                        {isSender && <Text type="secondary">{isSender.fullName}</Text>}
                        {message && <Content message={message} isSender={isSender} />}
                        {file && getFileComponent(file)}
                    </Flex>
                </Col>
            </Row>
        </Col>
    );
}

export default Message;

const styles = {
    conentText: {
        padding: 10,
        borderRadius: 8,
        background: "#f0f0f0",
        maxWidth: 250,
        whiteSpace: "pre-wrap"
    }
}