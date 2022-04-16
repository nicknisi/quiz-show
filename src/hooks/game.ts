import { useActor, useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { GameContext } from '../GameProvider';
import { useSuspensefulActor } from './useSuspensefulActor';

export const useGameService = () => {
  const context = useContext(GameContext);

  if (!context?.service) {
    throw new Error('useGameService must be used within a GameProvider');
  }

  const { service } = context;

  console.log('%cservice', 'font-weight:bold;color:green', service.state?.value);
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
  const [state] = useGameActor();
  const { contestants, currentContestant, currentQuestion, currentRound, name, rounds, style, winner } = state.context;
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
