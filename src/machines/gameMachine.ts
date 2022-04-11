import { createMachine } from 'xstate';

export interface GameMachineContext {}

export type GameMachineEvent = { type: 'CLICK' };

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>({
  id: 'gameMachine',
});

export default gameMachine;
