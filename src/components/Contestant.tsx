import { Contestant as ContestantData } from '../types';
import './contestant.module.css';

export interface ContestantProps extends ContestantData {
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
  large?: boolean;
}

export function Contestant({ onDecrement, onIncrement, large, name, handle, avatar, score }: ContestantProps) {
  return (
    <div className={`root ${large ? 'large' : ''}`}>
      <div className="actions">
        <button className="actionButton" onClick={() => onIncrement?.(100)}>
          +
        </button>
        <button className="actionButton" onClick={() => onDecrement?.(100)}>
          -
        </button>
      </div>
      <img className="avatar" src={avatar ? avatar : `http://localhost:8888/?handle=${handle}`} />
      <div className="info">
        <div className="name">{name}</div>
        <div className={`score, ${score >= 0 ? 'positive' : 'negative'}`}>{String(score)}</div>
      </div>
    </div>
  );
}
