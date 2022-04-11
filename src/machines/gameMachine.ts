import { createMachine } from 'xstate';

export interface GameMachineContext {}

export type GameMachineEvent = { type: 'CLICK' };

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>({
  id: 'gameMachine',
  initial: 'initial',
  states: {
    initial: {},
    idle: {},
    qustion: {
      initial: 'default',
      states: {
        default: {},
        showAnswer: {},
      },
    },
    contestants: {},
    winner: {},
  },
});

export default gameMachine;
