import { Avatar, Col, Flex, Row, Typography } from "antd";
import { File } from "../../types/message";
import { UserCoreType } from "../../types/user";
import { initialsName } from "../../utils/logic";

const Text = Typography.Text;

interface MessageProps {
    message?: string,
    file?: File | null,
    isSender: UserCoreType | null
}

const Content = ({ message, isSender }: { message: string, isSender: UserCoreType | null }) => {
    return (
        <Flex style={{ flex: 1, justifyContent: isSender ? "start" : "end" }}>
            <Text style={{ ...styles.conentText, textAlign: isSender ? "start" : "end" }}>{message}</Text>
        </Flex>
    );
}

const Message = ({ message, file, isSender }: MessageProps) => {
    return (
        <Col span={24}>
            <Row align="bottom" style={{ width: "100%" }}>
                <Col span={3}>
                    {
                        isSender && <Avatar src={isSender.avatar}>{initialsName(isSender.fullName)}</Avatar>
                    }
                </Col>
                <Col span={21}>
                    <Flex vertical>
                        {isSender && <Text type="secondary">{isSender.fullName}</Text>}
                        {message && <Content message={message} isSender={isSender} />}
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