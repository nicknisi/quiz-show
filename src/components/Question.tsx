import { Category, Question as QuestionData } from '../types';
import './question.module.css';

export interface QuestionProps {
  question: QuestionData;
  category: Category;
  onClick?: (question?: QuestionData) => void;
  showAnswer?: boolean;
  onShowAnswer?: () => void;
  final?: boolean;
}

export function Question({
  question: { clue, answer, image, value },
  category,
  onClick,
  onShowAnswer,
  showAnswer,
  final,
}: QuestionProps) {
  return (
    <div className={`question ${final ? 'finalQuestion' : ''}`} onClick={() => onClick?.()}>
      <div className="questionInfo">
        <div className="category">{category.name}</div>
        <div className="value">{value}</div>
      </div>
      {image && (
        <div className="imageWrapper">
          <img className="image" src={image} alt={clue} />
        </div>
      )}
      {showAnswer ? (
        <div className="answer">{answer}</div>
      ) : (
        <>
          <div
            className="showAnswer"
            onClick={(event) => {
              event.stopPropagation();
              onShowAnswer?.();
            }}
          >
            Show Answer
          </div>
        </>
      )}
    </div>
  );
}

export default Question;
