import { Contestant as ContestantType } from '../types';
import { Contestant } from './Contestant';
import classes from './Contestants.module.css';

export interface ContestantsProps {
  contestants: ContestantType[];
  horizontal?: boolean;
}

export const Contestants = ({ contestants, horizontal }: ContestantsProps) => (
  <div className={`${classes.root} ${horizontal ? classes.horizontal : ''}`}>
    {contestants.map((contestant) => (
      <Contestant large={horizontal} {...contestant} key={contestant.name} />
    ))}
  </div>
);
