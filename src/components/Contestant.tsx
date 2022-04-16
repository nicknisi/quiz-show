import { Contestant as ContestantData } from '../types';
import classes from './contestant.module.css';

export interface ContestantProps extends ContestantData {
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
  large?: boolean;
}

export function Contestant({ onDecrement, onIncrement, large, name, handle, avatar, score }: ContestantProps) {
  return (
    <div className={`${classes.root} ${large ? classes.large : ''}`}>
      <div className="actions">
        <button className={classes.actionButton} onClick={() => onIncrement?.(100)}>
          +
        </button>
        <button className={classes.actionButton} onClick={() => onDecrement?.(100)}>
          -
        </button>
      </div>
      <img className={classes.avatar} src={avatar ? avatar : `http://localhost:8888/?handle=${handle}`} />
      <div className={classes.info}>
        <div className={classes.name}>{name}</div>
        <div className={`${classes.score}, ${score >= 0 ? classes.positive : classes.negative}`}>{String(score)}</div>
      </div>
    </div>
  );
}
