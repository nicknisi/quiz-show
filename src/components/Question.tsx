import { useState } from 'react';
import { Question as QuestionData } from '../types';

export interface QuestionProps {
  question: QuestionData;
  category: string;
  onClick?: (question?: QuestionData) => void;
  onShowAnswer?: () => void;
  final?: boolean;
}

export function Question({
  question: { clue, answer, image, value },
  category,
  onClick,
  onShowAnswer,
  final,
}: QuestionProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`question ${final ? 'finalQuestion' : ''}`} onClick={() => onClick?.()}>
      <div className="questionInfo">
        <div className="category">{category}</div>
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
              setShowAnswer(true);
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
