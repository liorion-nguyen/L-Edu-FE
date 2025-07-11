import { EditOutlined, EyeOutlined, FileTextOutlined, HighlightOutlined, PlayCircleOutlined, QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Switch, Tabs, Tooltip, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MarkdownViewer from "../../../components/common/MarkdownViewer";
import ReturnPage from "../../../components/common/ReturnPage";
import { COLORS, RADIUS, SPACING } from "../../../constants/colors";
import SectionLayout from "../../../layouts/SectionLayout";
import { getSessionById, updateSession } from "../../../redux/slices/courses";
import { RootState, useDispatch } from "../../../redux/store";
import { initialValuesType } from "../../../types/session";

const { Option } = Select;
const { Title, Text } = Typography;

const UpdateSession = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { session } = useSelector((state: RootState) => state.courses);
    const [markdownContent, setMarkdownContent] = useState("");
    const [activeTab, setActiveTab] = useState("edit");
    const [isLiveEdit, setIsLiveEdit] = useState(false);
    const [editableContent, setEditableContent] = useState("");

    useEffect(() => {
        if (session) {
            const notesMd = session.notesMd?.notesMd || "";
            setMarkdownContent(notesMd);
            setEditableContent(notesMd);
            form.setFieldsValue({
                courseId: session.courseId,
                sessionNumber: session.sessionNumber,
                title: session.title,
                quizId: session.quizId?.quizId,
                modeQuizId: session.quizId?.mode,
                videoUrl: session.videoUrl?.videoUrl,
                modeVideoUrl: session.videoUrl?.mode,
                notesMd: notesMd,
                modeNoteMd: session.notesMd?.mode,
                mode: session.mode ?? "CLOSE",
            });
        }
    }, [session]);

    useEffect(() => {
        dispatch(getSessionById(id as string));
    }, [id, dispatch]);

    const onFinish = async (values: initialValuesType) => {
        await dispatch(updateSession({ id: id as string, values }));
    };

    const handleMarkdownChange = (value: string) => {
        setMarkdownContent(value);
        setEditableContent(value);
        form.setFieldValue('notesMd', value);
    };

    const handleEditableChange = (e: any) => {
        const value = e.target.innerText || "";
        setEditableContent(value);
        setMarkdownContent(value);
        form.setFieldValue('notesMd', value);
    };

    const getStatusColor = (status: string) => {
        return status === "OPEN" ? COLORS.status.success : COLORS.status.error;
    };

    const getStatusText = (status: string) => {
        return status === "OPEN" ? "Mở" : "Đóng";
    };

    const insertMarkdownSyntax = (syntax: string) => {
        const textarea = document.querySelector('.markdown-editor') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = markdownContent.substring(start, end);
            let newText = "";
            
            switch (syntax) {
                case 'bold':
                    newText = `**${selectedText || 'text'}**`;
                    break;
                case 'italic':
                    newText = `*${selectedText || 'text'}*`;
                    break;
                case 'code':
                    newText = `\`${selectedText || 'code'}\``;
                    break;
                case 'heading':
                    newText = `# ${selectedText || 'Heading'}`;
                    break;
                case 'list':
                    newText = `- ${selectedText || 'List item'}`;
                    break;
                case 'link':
                    newText = `[${selectedText || 'link text'}](url)`;
                    break;
                default:
                    newText = selectedText;
            }
            
            const newContent = markdownContent.substring(0, start) + newText + markdownContent.substring(end);
            handleMarkdownChange(newContent);
            
            // Focus và đặt cursor
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + newText.length, start + newText.length);
            }, 10);
        }
    };

    const MarkdownToolbar = () => (
        <div style={styles.toolbar}>
            <Space size="small">
                <Tooltip title="Bold (Ctrl+B)">
                    <Button 
                        size="small" 
                        icon={<span style={{ fontWeight: 'bold' }}>B</span>}
                        onClick={() => insertMarkdownSyntax('bold')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
                <Tooltip title="Italic (Ctrl+I)">
                    <Button 
                        size="small" 
                        icon={<span style={{ fontStyle: 'italic' }}>I</span>}
                        onClick={() => insertMarkdownSyntax('italic')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
                <Tooltip title="Code">
                    <Button 
                        size="small" 
                        icon={<span style={{ fontFamily: 'monospace' }}>{ }</span>}
                        onClick={() => insertMarkdownSyntax('code')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
                <Tooltip title="Heading">
                    <Button 
                        size="small" 
                        icon={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>H</span>}
                        onClick={() => insertMarkdownSyntax('heading')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
                <Tooltip title="List">
                    <Button 
                        size="small" 
                        icon={<span>•</span>}
                        onClick={() => insertMarkdownSyntax('list')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
                <Tooltip title="Link">
                    <Button 
                        size="small" 
                        icon={<span>🔗</span>}
                        onClick={() => insertMarkdownSyntax('link')}
                        style={styles.toolbarButton}
                    />
                </Tooltip>
            </Space>
        </div>
    );

    const InlineEditor = () => (
        <div style={styles.inlineEditorContainer}>
            <div style={styles.inlineEditorHeader}>
                <Space>
                    <HighlightOutlined />
                    <Text strong>Live Editor Mode</Text>
                    <Switch 
                        checked={isLiveEdit}
                        onChange={setIsLiveEdit}
                        size="small"
                    />
                </Space>
                <Text style={styles.inlineHint}>
                    {isLiveEdit ? "Nhập markdown trực tiếp bên dưới" : "Bật Live Editor để chỉnh sửa"}
                </Text>
            </div>
            
            {isLiveEdit ? (
                <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditableChange}
                    style={styles.liveEditor}
                >
                    {editableContent || (
                        <span style={{ color: COLORS.text.muted, fontStyle: "italic" }}>
                            Nhập nội dung markdown tại đây...
                        </span>
                    )}
                </div>
            ) : (
                <div style={styles.previewContainer}>
                    {markdownContent ? (
                        <MarkdownViewer content={markdownContent} />
                    ) : (
                        <div style={styles.emptyPreview}>
                            <FileTextOutlined style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>
                                Chưa có nội dung để xem trước
                            </Text>
                            <Text style={styles.emptyHint}>
                                Hãy chuyển sang tab "Chỉnh sửa" hoặc bật "Live Editor"
                            </Text>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <SectionLayout style={styles.sectionLayout}>
            <div style={styles.container}>
                <ReturnPage />
                
                <div style={styles.header}>
                    <Title level={2} style={styles.title}>
                        <EditOutlined style={{ marginRight: 12 }} />
                        Cập Nhật Buổi Học
                    </Title>
                    <Text style={styles.subtitle}>
                        Chỉnh sửa thông tin buổi học và nội dung markdown với Live Editor
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Basic Information Card */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <FileTextOutlined />
                                    <span>Thông Tin Cơ Bản</span>
                                </Space>
                            }
                            style={styles.card}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                            >
                                <Form.Item label="Mã khóa học" name="courseId">
                                    <Input disabled style={styles.disabledInput} />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item 
                                            label="Số buổi" 
                                            name="sessionNumber" 
                                            rules={[{ required: true, message: "Vui lòng nhập số buổi!" }]}
                                        >
                                            <Input type="number" style={styles.input} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item 
                                            label="Trạng thái buổi học" 
                                            name="mode"
                                        >
                                            <Select style={styles.select}>
                                                <Option value="OPEN">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("OPEN") }}>●</span>
                                                        {getStatusText("OPEN")}
                                                    </Space>
                                                </Option>
                                                <Option value="CLOSE">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("CLOSE") }}>●</span>
                                                        {getStatusText("CLOSE")}
                                                    </Space>
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item 
                                    label="Tiêu đề" 
                                    name="title" 
                                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                                >
                                    <Input style={styles.input} />
                                </Form.Item>

                                <Divider orientation="left" style={styles.divider}>
                                    <QuestionCircleOutlined style={{ marginRight: 8 }} />
                                    Quiz Settings
                                </Divider>

                                <Row gutter={16}>
                                    <Col span={16}>
                                        <Form.Item label="Mã Quiz" name="quizId">
                                            <Input style={styles.input} placeholder="Nhập mã quiz (nếu có)" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Trạng thái" name="modeQuizId">
                                            <Select style={styles.select}>
                                                <Option value="OPEN">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("OPEN") }}>●</span>
                                                        {getStatusText("OPEN")}
                                                    </Space>
                                                </Option>
                                                <Option value="CLOSE">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("CLOSE") }}>●</span>
                                                        {getStatusText("CLOSE")}
                                                    </Space>
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider orientation="left" style={styles.divider}>
                                    <PlayCircleOutlined style={{ marginRight: 8 }} />
                                    Video Settings
                                </Divider>

                                <Row gutter={16}>
                                    <Col span={16}>
                                        <Form.Item label="URL Video" name="videoUrl">
                                            <Input style={styles.input} placeholder="Nhập URL video" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Trạng thái" name="modeVideoUrl">
                                            <Select style={styles.select}>
                                                <Option value="OPEN">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("OPEN") }}>●</span>
                                                        {getStatusText("OPEN")}
                                                    </Space>
                                                </Option>
                                                <Option value="CLOSE">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("CLOSE") }}>●</span>
                                                        {getStatusText("CLOSE")}
                                                    </Space>
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={16}>
                                        <Form.Item label="Trạng thái Ghi chú" name="modeNoteMd">
                                            <Select style={styles.select}>
                                                <Option value="OPEN">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("OPEN") }}>●</span>
                                                        {getStatusText("OPEN")}
                                                    </Space>
                                                </Option>
                                                <Option value="CLOSE">
                                                    <Space>
                                                        <span style={{ color: getStatusColor("CLOSE") }}>●</span>
                                                        {getStatusText("CLOSE")}
                                                    </Space>
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item style={{ textAlign: "center", marginTop: 30 }}>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                icon={<SaveOutlined />}
                                                size="large"
                                                style={styles.submitButton}
                                            >
                                                Cập Nhật
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item name="notesMd" style={{ display: 'none' }}>
                                    <Input.TextArea />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    {/* Enhanced Markdown Editor Card */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <FileTextOutlined />
                                    <span>Nội Dung Markdown</span>
                                </Space>
                            }
                            style={styles.card}
                        >
                            <Tabs 
                                activeKey={activeTab} 
                                onChange={setActiveTab}
                                style={styles.tabs}
                                items={[
                                    {
                                        key: "edit",
                                        label: (
                                            <Space>
                                                <EditOutlined />
                                                Chỉnh sửa
                                            </Space>
                                        ),
                                        children: (
                                            <div style={styles.editorContainer}>
                                                <MarkdownToolbar />
                                                <Input.TextArea
                                                    className="markdown-editor"
                                                    value={markdownContent}
                                                    onChange={(e) => handleMarkdownChange(e.target.value)}
                                                    placeholder="Nhập nội dung markdown tại đây..."
                                                    rows={18}
                                                    style={styles.markdownEditor}
                                                />
                                                <Text style={styles.editorHint}>
                                                    💡 Sử dụng toolbar hoặc cú pháp Markdown: **bold**, *italic*, `code`, # headers, etc.
                                                </Text>
                                            </div>
                                        )
                                    },
                                    {
                                        key: "live",
                                        label: (
                                            <Space>
                                                <HighlightOutlined />
                                                Live Editor
                                            </Space>
                                        ),
                                        children: <InlineEditor />
                                    },
                                    {
                                        key: "preview",
                                        label: (
                                            <Space>
                                                <EyeOutlined />
                                                Xem trước
                                            </Space>
                                        ),
                                        children: (
                                            <div style={styles.previewContainer}>
                                                {markdownContent ? (
                                                    <MarkdownViewer content={markdownContent} />
                                                ) : (
                                                    <div style={styles.emptyPreview}>
                                                        <FileTextOutlined style={styles.emptyIcon} />
                                                        <Text style={styles.emptyText}>
                                                            Chưa có nội dung để xem trước
                                                        </Text>
                                                        <Text style={styles.emptyHint}>
                                                            Hãy chuyển sang tab "Chỉnh sửa" để thêm nội dung markdown
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </SectionLayout>
    );
};

export default UpdateSession;

const styles: {
    [key: string]: CSSProperties;
} = {
    sectionLayout: {
        background: COLORS.background.secondary,
        minHeight: "100vh",
        padding: "20px 0",
    },
    container: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: `0 ${SPACING.lg}`,
    },
    header: {
        textAlign: "center",
        marginBottom: SPACING['2xl'],
    },
    title: {
        color: COLORS.text.heading,
        marginBottom: SPACING.sm,
        fontSize: "32px",
        fontWeight: 600,
    },
    subtitle: {
        color: COLORS.text.secondary,
        fontSize: "16px",
    },
    card: {
        background: COLORS.background.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.lg,
        height: "fit-content",
    },
    disabledInput: {
        background: COLORS.background.tertiary,
        color: COLORS.text.muted,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.md,
    },
    input: {
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.md,
        fontSize: "14px",
    },
    select: {
        width: "100%",
    },
    divider: {
        margin: `${SPACING.lg} 0`,
        color: COLORS.text.secondary,
        fontSize: "14px",
        fontWeight: 500,
    },
    submitButton: {
        background: COLORS.primary[500],
        border: "none",
        borderRadius: RADIUS.md,
        fontWeight: 500,
        width: "100%",
    },
    tabs: {
        marginTop: SPACING.md,
    },
    editorContainer: {
        height: "500px",
        display: "flex",
        flexDirection: "column",
    },
    toolbar: {
        padding: `${SPACING.sm} 0`,
        borderBottom: `1px solid ${COLORS.border.light}`,
        marginBottom: SPACING.sm,
    },
    toolbarButton: {
        border: `1px solid ${COLORS.border.light}`,
        background: COLORS.background.primary,
        color: COLORS.text.primary,
        fontSize: "12px",
        height: "28px",
        minWidth: "28px",
    },
    markdownEditor: {
        flex: 1,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.md,
        fontSize: "14px",
        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
        lineHeight: "1.6",
        padding: SPACING.md,
        resize: "none",
    },
    editorHint: {
        color: COLORS.text.muted,
        fontSize: "12px",
        marginTop: SPACING.sm,
        fontStyle: "italic",
    },
    inlineEditorContainer: {
        height: "500px",
        display: "flex",
        flexDirection: "column",
    },
    inlineEditorHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${SPACING.sm} 0`,
        borderBottom: `1px solid ${COLORS.border.light}`,
        marginBottom: SPACING.sm,
    },
    inlineHint: {
        color: COLORS.text.muted,
        fontSize: "12px",
        fontStyle: "italic",
    },
    liveEditor: {
        flex: 1,
        border: `2px dashed ${COLORS.primary[300]}`,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: "14px",
        lineHeight: "1.6",
        outline: "none",
        background: COLORS.background.primary,
        minHeight: "400px",
        overflow: "auto",
        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
        position: "relative",
    },
    previewContainer: {
        height: "500px",
        overflow: "auto",
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        background: COLORS.background.primary,
    },
    emptyPreview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
    },
    emptyIcon: {
        fontSize: "48px",
        color: COLORS.text.muted,
        marginBottom: SPACING.md,
    },
    emptyText: {
        color: COLORS.text.secondary,
        fontSize: "16px",
        marginBottom: SPACING.sm,
    },
    emptyHint: {
        color: COLORS.text.muted,
        fontSize: "14px",
    },
};