import { assign, createMachine } from 'xstate';
import { Category, Contestant, Game, Question, Round } from '../types';

export interface GameMachineContext {
  name: string;
  style: string;
  currentRound: number;
  currentContestant?: Contestant | null;
  contestants: Contestant[];
  pointsAtStake: number;
  currentQuestion?: {
    category: Category;
    question: Question;
  };
  rounds: Round[];
  winner?: Contestant;
  url: string;
}

export type GameMachineEvent =
  | {
      type: 'SELECT_QUESTION';
      data: {
        question: Question;
        category: Category;
      };
    }
  | { type: 'TOGGLE_ANSWER' }
  | { type: 'SET_ROUND'; data: { round: number } }
  | { type: 'TOGGLE_CONTESTANTS' }
  | { type: 'SET_WINNER'; data: { winner: Contestant } }
  | { type: 'INCREMENT_SCORE'; contestant: Contestant }
  | { type: 'DECREMENT_SCORE'; contestant: Contestant }
  | { type: 'SET_CURRENT_CONTESTANT'; data: { contestant: Contestant } };

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>(
  {
    id: 'gameMachine',
    preserveActionOrder: true,
    initial: 'initial',
    states: {
      initial: {
        always: 'load',
      },
      load: {
        initial: 'initial',
        tags: ['loading'],
        onDone: 'game',
        states: {
          initial: {
            entry: assign({
              url: () => '/assets/tricks.json',
            }),
            always: 'loadGame',
          },
          loadGame: {
            invoke: {
              id: 'loadGame',
              src: 'loadGameData',
              onError: 'error',
              onDone: {
                target: 'done',
                actions: assign({
                  contestants: (_context, event) => event.data.contestants,
                  rounds: (_context, event) => event.data.rounds,
                  name: (_context, event) => event.data.name,
                  style: (_context, event) => event.data.style,
                  currentRound: () => 0,
                }),
              },
            },
          },
          error: {},
          done: {
            type: 'final',
          },
        },
      },
      game: {
        initial: 'idle',
        on: {
          SET_WINNER: {
            target: 'winner',
            actions: assign({
              winner: (_context, event) => event.data.winner,
            }),
          },
        },
        states: {
          idle: {
            on: {
              TOGGLE_CONTESTANTS: {
                target: 'contestants',
              },
              SELECT_QUESTION: {
                target: 'question',
                actions: assign({
                  currentQuestion: (_context, event) => {
                    const { question, category } = event.data;
                    return { question, category };
                  },
                }),
              },
            },
          },
          question: {
            initial: 'default',
            states: {
              default: {
                on: {
                  SET_CURRENT_CONTESTANT: {
                    actions: assign({
                      currentContestant: (_context, { data: { contestant } }) => contestant,
                    }),
                  },
                  TOGGLE_ANSWER: {
                    target: 'showAnswer',
                    actions: assign({
                      currentQuestion: ({ currentQuestion }) => {
                        if (!currentQuestion) {
                          throw new TypeError('currentQuestion is undefined');
                        }
                        const { question, category } = currentQuestion;
                        question.used = true;
                        return { question, category };
                      },
                    }),
                  },
                },
              },
              showAnswer: {
                entry: assign({
                  currentQuestion: ({ currentQuestion }) => {
                    currentQuestion!.question.used = true;
                    return currentQuestion;
                  },
                }),
                on: {
                  INCREMENT_SCORE: {
                    actions: assign({
                      currentContestant: ({ currentContestant, currentQuestion }) => {
                        currentContestant!.score += currentQuestion!.question.value;
                        return currentContestant;
                      },
                    }),
                  },
                  DECREMENT_SCORE: {
                    actions: assign({
                      currentContestant: ({ currentContestant, currentQuestion }) => {
                        currentContestant!.score -= currentQuestion!.question.value;
                        return currentContestant;
                      },
                    }),
                  },
                  TOGGLE_ANSWER: {
                    target: 'default',
                    actions: assign({
                      currentQuestion: (_context) => undefined,
                      currentContestant: (_context) => undefined,
                    }),
                  },
                },
              },
            },
          },
          contestants: {
            on: {
              TOGGLE_CONTESTANTS: {
                target: 'idle',
              },
            },
          },
        },
      },
      winner: {
        type: 'final',
      },
    },
  },
  {
    services: {
      loadGameData:
        ({ url }) =>
        async () => {
          const response = await fetch(url);
          const game: Game = (await response.json()).game;
          return game;
        },
    },
  },
);

export default gameMachine;
