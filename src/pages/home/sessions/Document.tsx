import { EyeOutlined } from "@ant-design/icons";
import { Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import MarkdownViewer from "../../../components/common/MarkdownViewer";
import ReturnPage from "../../../components/common/ReturnPage";
import SectionLayout from "../../../layouts/SectionLayout";
import { getSessionById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";

const Text = Typography.Text;
const Document = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { session, loading } = useSelector((state: RootState) => state.courses);
    
    useEffect(() => {
        fetch();
    }, [id, dispatch]);
    
    const fetch = async () => {
        try {
            const result = await dispatch(getSessionById(id as string));
            if (getSessionById.rejected.match(result)) {
                navigate(-1);
            }
        } catch (error) {
            navigate(-1);
        }
    }
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