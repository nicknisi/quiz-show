import { assign, createMachine } from 'xstate';
import { play, stop } from '../audio';
import { Category, Game, GameStyle, Player, Question, Round } from '../types';

export interface GameMachineContext {
  name: string;
  style: GameStyle;
  currentRound: number;
  currentContestant?: Player | null;
  contestants: Player[];
  pointsAtStake: number;
  currentQuestion?: {
    category: Category;
    question: Question;
  };
  rounds: Round[];
  winner?: Player;
  url: string;
}

export type GameAudioEvent =
  | 'CORRECT_ANSWER'
  | 'INCORRECT_ANSWER'
  | 'CORRECT_STEAL'
  | 'INCORRECT_STEAL'
  | 'TIME_UP'
  | 'THEME'
  | 'STOP_AUDIO'
  | 'STRESS'
  | 'WINNER';

export type GameMachineEvent =
  | {
      type: 'SELECT_QUESTION';
      data: {
        question: Question;
        category: Category;
      };
    }
  | { type: 'TOGGLE_ANSWER' | 'TOGGLE_CONTESTANTS' | 'CLOSE_QUESTION' }
  | { type: 'SET_ROUND'; data: { round: number } }
  | { type: 'SET_WINNER'; winner: Player | undefined }
  | { type: 'INCREMENT_SCORE' | 'DECREMENT_SCORE'; handle: string; value: number }
  | { type: 'SET_CURRENT_CONTESTANT'; data: { contestant: Player } }
  | { type: GameAudioEvent };

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>(
  {
    id: 'gameMachine',
    preserveActionOrder: true,
    initial: 'initial',
    on: {
      STOP_AUDIO: { actions: 'stopAudio' },
      THEME: { actions: 'playAudio' },
      STRESS: { actions: 'playAudio' },
    },
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
          INCREMENT_SCORE: {
            actions: assign({
              contestants: (context, event) => {
                const { contestants } = context;
                const { value, handle } = event;
                const index = contestants.findIndex((c) => c.handle === handle);
                const player = contestants[index];
                const newPlayer = { ...player, score: player.score + value };
                return [...contestants.slice(0, index), newPlayer, ...contestants.slice(index + 1)];
              },
            }),
          },
          DECREMENT_SCORE: {
            actions: assign({
              contestants: (context, event) => {
                const { contestants } = context;
                const { value, handle } = event;
                const index = contestants.findIndex((c) => c.handle === handle);
                const player = contestants[index];
                const newPlayer = { ...player, score: player.score - value };
                return [...contestants.slice(0, index), newPlayer, ...contestants.slice(index + 1)];
              },
            }),
          },
          SET_ROUND: {
            target: '.idle',
            actions: assign({
              currentRound: (_context, event) => event.data.round,
            }),
          },
          SET_WINNER: {
            target: 'winner',
            actions: assign({
              winner: (_context, event) => {
                const { winner } = event;
                console.log('WINNER', winner, event);
                return winner;
              },
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
            on: {
              CLOSE_QUESTION: {
                target: 'idle',
                actions: assign({
                  currentQuestion: (_context) => undefined,
                }),
              },
            },
            states: {
              default: {
                on: {
                  CORRECT_ANSWER: { actions: 'playAudio' },
                  INCORRECT_ANSWER: { actions: 'playAudio' },
                  CORRECT_STEAL: { actions: 'playAudio' },
                  INCORRECT_STEAL: { actions: 'playAudio' },
                  TIME_UP: { actions: 'playAudio' },
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
    actions: {
      playAudio: ({ style }, { type }) => {
        switch (type) {
          case 'THEME':
            play(`${style}Theme`);
            break;
          case 'CORRECT_ANSWER':
            play('correctAnswer');
            break;
          case 'INCORRECT_ANSWER':
            play('wrongAnswer');
            break;
          case 'CORRECT_STEAL':
            play('correctSteal');
            break;
          case 'INCORRECT_STEAL':
            play('wrongSteal');
            break;
          case 'WINNER':
            play(`${style}Winner`);
            break;
          case 'TIME_UP':
            play('timesUp');
            break;
          case 'STRESS':
            play('jsDangerStressTheme');
            break;
        }
      },
      stopAudio: () => stop(),
    },
  },
);

export default gameMachine;
