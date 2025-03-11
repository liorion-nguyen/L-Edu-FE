import { Flex, Spin } from "antd";

const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const content = <div style={contentStyle} />;

const Loading = () => {
    return (
        <Flex gap="middle" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spin tip="Loading" size="large">
                {content}
            </Spin>
        </Flex>
    );
}
export default Loading;