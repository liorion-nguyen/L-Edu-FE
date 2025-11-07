import { Button } from "antd";
import { ExamQuestion } from "../../types/exam";

interface QuestionNavigatorProps {
  questions: ExamQuestion[];
  currentIndex: number;
  onSelect: (index: number) => void;
  answeredQuestionIds?: Set<string>;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  onSelect,
  answeredQuestionIds,
}) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))", gap: 8 }}>
      {questions.map((question, index) => {
        const isActive = index === currentIndex;
        const answered = answeredQuestionIds?.has(question._id);
        return (
          <Button
            key={question._id}
            type={isActive ? "primary" : answered ? "default" : "dashed"}
            onClick={() => onSelect(index)}
            style={{ padding: 0, width: "100%" }}
          >
            {index + 1}
          </Button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator;

