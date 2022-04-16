import { Category as CategoryData, Question } from '../types';
import './category.module.css';

export interface CategoryProps {
  category: CategoryData;
  onClick: (question: Question) => void;
}

export const Category = ({ onClick, category: { name, questions } }: CategoryProps) => {
  return (
    <div className="root">
      <div className="box title">{name}</div>
      {questions.map((question) => (
        <div className="box" onClick={() => onClick(question)}>
          {!question.used && <div className="value">{question.value}</div>}
        </div>
      ))}
    </div>
  );
};

export default Category;
