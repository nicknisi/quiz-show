import { Category as CategoryData } from '../types';

export interface CategoryProps extends CategoryData {}

export const Category = ({ name, questions }: CategoryProps) => {
  return (
    <div className="root">
      <div className="box title">{name}</div>
      {questions.map((question) => (
        <div
          className="box"
          onClick={() => {
            // TODO: set current question
          }}
        >
          {!question.used && <div className="value">{question.value}</div>}
        </div>
      ))}
    </div>
  );
};

export default Category;
