import { Col, Row } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import MarkdownViewer from "../../../components/common/MarkdownViewer";

const Document = () => {
    const document = {
        id: "1",
        title: "Tuần sinh hoạt Công dân-HSSV năm học 2021-2022 cho sinh viên K71",
        content: "hello",
        status: "Open",
        video: "",
        quiz: ""
    };

    const markdownContent = `
# Hướng Dẫn Xuất Bản Ứng Dụng React Native

## 1. Tổng Quan Quy Trình Xuất Bản Ứng Dụng
Xuất bản ứng dụng React Native yêu cầu:
1. Thiết lập và kiểm tra các cấu hình cần thiết cho ứng dụng.
2. Chuẩn bị biểu tượng (icon) và màn hình chờ (splash screen) phù hợp.
3. Sử dụng **EAS** để build và xuất bản ứng dụng lên cửa hàng (App Store hoặc Google Play).

## 2. Các Cấu Hình Quan Trọng Cần Nắm Vững
Các bước cấu hình cơ bản:
`;

    return (
        <SectionLayout title={document.title}>
            <Row style={{ margin: "50px 0" }} gutter={[20, 20]}>
                <Col span={24}>
                <MarkdownViewer content={markdownContent} />
                </Col>
            </Row>
        </SectionLayout>
    );
}

export default Document;