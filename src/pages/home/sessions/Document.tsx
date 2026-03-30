import { EyeOutlined } from "@ant-design/icons";
import { Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardProgramBackButton from "../../../components/common/DashboardProgramBackButton";
import Loading from "../../../components/common/Loading";
import MarkdownViewer from "../../../components/common/MarkdownViewer";
import ReturnPage from "../../../components/common/ReturnPage";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import SectionLayout from "../../../layouts/SectionLayout";
import { getSessionById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { isDashboardProgramLearnPath } from "../../../utils/studentDashboardRoutes";

const Text = Typography.Text;
const Document = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();
  const { session, loading } = useSelector((state: RootState) => state.courses);
  const isDashboardLearn = isDashboardProgramLearnPath(location.pathname);

  const fetch = async () => {
    try {
      const result = await dispatch(getSessionById(id as string));
      if (getSessionById.rejected.match(result)) {
        navigate(-1);
      }
    } catch (error) {
      navigate(-1);
    }
  };

  useEffect(() => {
    fetch();
  }, [id, dispatch, navigate]);

  if (isDashboardLearn) {
    return (
      <div className="w-full space-y-5">
        <DashboardProgramBackButton />
        {loading ? (
          <Loading />
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 md:p-8 shadow-sm text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6">
              <EyeOutlined className="text-primary" />
              <Text className="text-slate-600 dark:text-slate-300">
                {session?.views || 0} {t("courseDetail.views")}
              </Text>
            </div>
            <div className="markdown-dashboard-learn max-w-none text-slate-800 dark:text-slate-100">
              <MarkdownViewer className="markdown-dashboard-learn" content={session?.notesMd?.notesMd ?? ""} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <SectionLayout title={document.title}>
      <ReturnPage />
      {loading ? (
        <Loading />
      ) : (
        <Row style={{ margin: "50px 0" }} gutter={[20, 20]}>
          <Col span={24}>
            <Flex gap={5}>
              <EyeOutlined />
              <Text>{session?.views || 0} {t("courseDetail.views")}</Text>
            </Flex>
          </Col>
          <Col span={24}>
            <MarkdownViewer content={session?.notesMd?.notesMd ?? ""} />
          </Col>
        </Row>
      )}
    </SectionLayout>
  );
};

export default Document;
