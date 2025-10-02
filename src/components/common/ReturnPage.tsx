import { RollbackOutlined } from "@ant-design/icons";
import { Button, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const ReturnPage = ({ dir="start" }: { dir?: any }) => {
    const navigate = useNavigate();
    const { t } = useTranslationWithRerender();
    
    return (
        <Col span={24} style={{ marginTop: "20px", textAlign: dir }}>
            <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() => navigate(-1)}
            >
                {t('common.returnToPrevious')}
            </Button>
        </Col>
    );
}

export default ReturnPage;  