import { useMemo } from 'react';
import { useQuestion } from '../hooks/game';
import { Round as RoundType } from '../types';
import { Category } from './Category';
import { Question } from './Question';
import classes from './Round.module.css';

export interface BaseRoundProps {
  round: RoundType;
}

export function RegularRound({ round }: BaseRoundProps) {
  const { selectQuestion, toggleAnswer, currentQuestion, showAnswer, closeQuestion } = useQuestion();
  const question = useMemo(() => currentQuestion?.question, [currentQuestion]);
  const category = useMemo(() => currentQuestion?.category, [currentQuestion]);
  const { categories } = round;
  return (
    <div key="grid" className={`${classes.root} ${categories.length === 4 ? classes.fourColumns : ''}`}>
      {categories.map((category) => (
        <Category category={category} key={category.name} onClick={(question) => selectQuestion(question, category)} />
      ))}

      {question && category ? (
        <Question
          question={question}
          category={category}
          showAnswer={showAnswer}
          onClick={() => {
            // clear current question
            console.log('%cClearing question', 'font-weight:bold;color:green', question);
            closeQuestion();
          }}
          onShowAnswer={() => {
            // show answer
            toggleAnswer();
            console.log('%cToggling answer', 'font-weight:bold;color:green');
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export function FinalRound({ round }: BaseRoundProps) {
  const { currentQuestion: current } = useQuestion();
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
