import { RollbackOutlined } from "@ant-design/icons";
import { Button, Col } from "antd";
import { useNavigate } from "react-router-dom";

const ReturnPage = ({ dir="start" }: { dir?: any }) => {
    const navigate = useNavigate();
    return (
        <Col span={24} style={{ marginTop: "20px", textAlign: dir }}>
            <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() => navigate(-1)}
            >
                Return to previous page
            </Button>
        </Col>
    );
}

export default ReturnPage;  