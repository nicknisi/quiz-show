import { Category as CategoryType, Question as QuestionType, Round as RoundType } from '../types';
import { Category } from './Category';
import { Question } from './Question';
import classes from './Round.module.css';

export interface BaseRoundProps {
  round: RoundType;
  currentQuestion?: { question: QuestionType; category: CategoryType };
}

export function RegularRound({ round, currentQuestion }: BaseRoundProps) {
  const question = currentQuestion?.question;
  const category = currentQuestion?.category;
  const { categories } = round;
  return (
    <div key="grid" className={`${classes.root} ${categories.length === 4 ? classes.fourColumns : ''}`}>
      {categories.map((category) => (
        <Category category={category} key={category.name} onClick={() => {}} />
      ))}

      {question && category ? (
        <Question
          question={question}
          category={category}
          onClick={() => {
            // set current question
          }}
          onShowAnswer={() => {
            // show answer
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export function FinalRound({ round, currentQuestion: current }: BaseRoundProps) {
  const [
    {
      name: category,
      questions: [question],
    },
  ] = round.categories;
  const currentQuestion = current?.question;
  const currentCategory = current?.category;
  return (
    <div className={classes.final}>
      {currentQuestion && currentCategory ? (
        <Question
          final
          question={question}
          category={currentCategory}
          onClick={() => {
            // clear current qustion
          }}
        />
      ) : (
        <div
          className={classes.category}
          onClick={() => {
            // set current question
          }}
        >
          Final round category: {category}
        </div>
      )}
    </div>
  );
}

export interface RoundProps extends BaseRoundProps {
  final?: boolean;
}

export const Round = ({ final, ...props }: RoundProps) =>
  final ? <FinalRound {...props} /> : <RegularRound {...props} />;
