import { InfoCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Form, FormInstance, Input, InputNumber, Row, Select, Space, Tag, Tooltip } from "antd";
import { useMemo } from "react";
import { ExamQuestionType } from "../../types/exam";

const QUESTION_TYPE_OPTIONS = [
  { label: "Một đáp án", value: ExamQuestionType.SINGLE },
  { label: "Nhiều đáp án", value: ExamQuestionType.MULTIPLE },
  { label: "Điền nội dung", value: ExamQuestionType.FILL_IN },
];

interface QuestionFormProps {
  field: any;
  remove: (index: number | number[]) => void;
  form: FormInstance;
  index: number;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ field, remove, form, index }) => {
  const currentType: ExamQuestionType = Form.useWatch([field.name, "type"], form) ?? ExamQuestionType.SINGLE;

  const optionLabel = useMemo(() => {
    if (currentType === ExamQuestionType.SINGLE) return "Đáp án";
    if (currentType === ExamQuestionType.MULTIPLE) return "Các đáp án";
    return "Đáp án chấp nhận";
  }, [currentType]);

  return (
    <Card
      title={
        <Space>
          <Tag color="blue">Câu {index + 1}</Tag>
          <Form.Item name={[field.name, "type"]} noStyle initialValue={ExamQuestionType.SINGLE}>
            <Select style={{ width: 180 }} options={QUESTION_TYPE_OPTIONS} />
          </Form.Item>
        </Space>
      }
      extra={
        <Tooltip title="Xoá câu hỏi">
          <MinusCircleOutlined style={{ color: "var(--error-color)" }} onClick={() => remove(field.name)} />
        </Tooltip>
      }
      style={{ marginBottom: 16 }}
    >
      <Form.Item
        name={[field.name, "content"]}
        label="Nội dung câu hỏi"
        rules={[{ required: true, message: "Nhập nội dung câu hỏi" }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
      <Form.Item
        name={[field.name, "points"]}
        label={
          <span>
            Điểm
            <Tooltip title="Điểm số của câu hỏi này trong tổng bài kiểm tra">
              <InfoCircleOutlined style={{ marginLeft: 6, color: "var(--text-secondary)" }} />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: "Nhập số điểm" }]}
        initialValue={1}
      >
            <InputNumber min={0.5} step={0.5} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={[field.name, "tags"]} label="Tags">
            <Select mode="tags" placeholder="Ví dụ: oop, array" />
          </Form.Item>
        </Col>
      </Row>

      {currentType === ExamQuestionType.FILL_IN ? (
        <Form.List name={[field.name, "textAnswers"]}>
          {(answerFields, { add, remove: removeAnswer }) => (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>{optionLabel}</div>
              {answerFields.map((answerField, answerIndex) => (
                <Space key={answerField.key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                  <Form.Item
                    name={[answerField.name]}
                    fieldKey={answerField.fieldKey}
                    rules={[{ required: true, message: "Nhập đáp án" }]}
                  >
                    <Input placeholder={`Đáp án ${answerIndex + 1}`} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => removeAnswer(answerField.name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Thêm đáp án</Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      ) : (
        <Form.List name={[field.name, "options"]}>
          {(optionFields, { add, remove: removeOption }) => (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>{optionLabel}</div>
              {optionFields.map((optionField, optionIndex) => (
                <Row key={optionField.key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                  <Col flex="auto">
                    <Form.Item
                      name={[optionField.name, "text"]}
                      fieldKey={optionField.fieldKey}
                      rules={[{ required: true, message: "Nhập nội dung đáp án" }]}
                    >
                      <Input placeholder={`Đáp án ${optionIndex + 1}`} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item valuePropName="checked" name={[optionField.name, "isCorrect"]} initialValue={optionIndex === 0}>
                      <Checkbox>{currentType === ExamQuestionType.SINGLE ? "Đúng" : "Thuộc đáp án"}</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add({ isCorrect: false })} block icon={<PlusOutlined />}>
                  Thêm lựa chọn
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      )}

      <Form.Item name={[field.name, "explanation"]} label="Giải thích">
        <Input.TextArea rows={2} placeholder="Giải thích đáp án (tuỳ chọn)" />
      </Form.Item>
    </Card>
  );
};

export default QuestionForm;

