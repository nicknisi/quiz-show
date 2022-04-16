import { useActor, useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { StateValueMap } from 'xstate';
import { GameContext } from '../GameProvider';
import { GameView } from '../types';

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
  const service = useGameService();
  const { contestants, currentContestant, currentQuestion, currentRound, name, rounds, style, winner } = useSelector(
    service,
    (state) => state.context,
  );
  const round = useMemo(() => rounds?.[currentRound], [rounds, currentRound]);
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
  };
};

export const useGameView = () => {
  const service = useGameService();
  return useSelector(service, (state) => (state.value as StateValueMap)?.game as GameView);
};
