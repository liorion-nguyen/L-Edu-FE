import { CheckOutlined } from "@ant-design/icons";
import { ExamQuestion } from "../../types/exam";
import "./QuestionNavigator.css";

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
    <div className="question-navigator-grid">
      {questions.map((question, index) => {
        const isActive = index === currentIndex;
        const answered = answeredQuestionIds?.has(question._id);
        return (
          <button
            key={question._id}
            className={`question-nav-button ${isActive ? 'active' : ''} ${answered ? 'answered' : 'unanswered'}`}
            onClick={() => onSelect(index)}
          >
            {answered && <CheckOutlined className="nav-check-icon" />}
            <span className="nav-question-number">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator;

