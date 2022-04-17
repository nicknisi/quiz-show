import { useActor, useSelector } from '@xstate/react';
import { useCallback, useContext, useMemo } from 'react';
import { StateFrom, StateValueMap } from 'xstate';
import { GameContext } from '../GameProvider';
import { gameMachine, GameMachineContext } from '../machines/gameMachine';
import { Category, GameView, Question } from '../types';

export const useGameService = () => {
  const context = useContext(GameContext);

  if (!context?.service) {
    throw new Error('useGameService must be used within a GameProvider');
  }

  const { service } = context;

  (window as any).service = service;

  return service;
};

export const useGameActor = () => {
  const service = useGameService();
  const actor = useActor(service);
  return actor;
};

export const useGameStatus = () => {
  const service = useGameService();
  const loaded = useSelector(service, (state) => state.matches('game'));
  return loaded;
};

export const useGameData = () => {
  const [state, send] = useGameActor();
  const { contestants, currentContestant, currentQuestion, currentRound, name, rounds, style, winner } = state.context;
  const round = useMemo(() => rounds?.[currentRound], [rounds, currentRound]);
  const numRounds = useMemo(() => rounds?.length, [rounds]);
  const nextRound = useCallback(
    (round?: number) => {
      if (round === undefined) {
        round = currentRound + 1;
      }
      if (round > numRounds - 1) {
        round = 0;
      }
      send({ type: 'SET_ROUND', data: { round } });
    },
    [numRounds, currentRound],
  );
  return {
    contestants,
    currentContestant,
    currentQuestion,
    currentRound,
    name,
    rounds,
    style,
    winner,
    round,
    numRounds,
    nextRound,
  };
};

export const useGameView = () => {
  const service = useGameService();
  return useSelector(service, (state) => (state.value as StateValueMap)?.game as GameView);
};

export const useQuestion = () => {
  const service = useGameService();
  const currentQuestion = useSelector(service, (state) => state.context.currentQuestion);
  const selectQuestion = useCallback(
    (question: Question, category: Category) => service.send({ type: 'SELECT_QUESTION', data: { question, category } }),
    [service],
  );
  const toggleAnswer = useCallback(() => service.send({ type: 'TOGGLE_ANSWER' }), [service]);
  const showAnswer = useSelector(service, (state) => state.matches('game.question.showAnswer'));
  const closeQuestion = useCallback(() => service.send({ type: 'CLOSE_QUESTION' }), [service]);
  return {
    showAnswer,
    selectQuestion,
    toggleAnswer,
    currentQuestion,
    closeQuestion,
  };
};

export const useSendEvent = () => {
  const service = useGameService();
  return service.send;
};

export const useGameSelector = <T>(selector: (state: StateFrom<typeof gameMachine>) => T) => {
  const service = useGameService();
  return useSelector(service, selector);
};

export const useValue = <K extends keyof GameMachineContext, V extends GameMachineContext[K]>(key: K) =>
  useGameSelector<V>((state) => state.context[key] as V);
