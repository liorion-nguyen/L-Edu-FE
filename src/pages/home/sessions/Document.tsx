import { Col, Flex, Row, Typography } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import MarkdownViewer from "../../../components/common/MarkdownViewer";
import { EyeOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getSessionById } from "../../../redux/slices/courses";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import ReturnPage from "../../../components/common/ReturnPage";

const Text = Typography.Text;
const Document = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetch();
    }, [id, dispatch]);
    const fetch = async () => {
        const check = await dispatch(getSessionById(id as string));
        if (!check) {
            navigate(-1);
        }
    }
    const { session, loading } = useSelector((state: RootState) => state.courses);
    return (
        <SectionLayout title={document.title}>
            <ReturnPage />
            {
                session && loading ? <Loading /> :
                    <Row style={{ margin: "50px 0" }} gutter={[20, 20]}>
                        <Col span={24}>
                            <Flex gap={5}>
                                <EyeOutlined />
                                <Text>{session?.views || 0} views</Text>
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <MarkdownViewer content={session?.notesMd?.notesMd ?? ""} />
                        </Col>
                    </Row>
            }
        </SectionLayout>
    );
}

export default Document;