import { GameAudioEvent } from '../machines/gameMachine';
import { useSendEvent } from './game';
import { useEffectOnce } from './utils';

export const useAudioControls = () => {
  const sendEvent = useSendEvent();
  const send = (type: GameAudioEvent) => sendEvent({ type });
  useEffectOnce(() => {
    const listener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
        case 'q':
        case 'Q':
          send('STOP_AUDIO');
          break;
        case 'b':
        case 'B':
          send('TIME_UP');
          break;
        case 'y':
          send('CORRECT_ANSWER');
          break;
        case 'Y':
          send('CORRECT_STEAL');
          break;
        case 'n':
          send('INCORRECT_ANSWER');
          break;
        case 'N':
          send('INCORRECT_STEAL');
          break;
        case 't':
          send('THEME');
          break;
        case 'T':
          send('STRESS');
          break;
        case 'w':
          send('WINNER');
          break;
      }
    };
    globalThis.document.addEventListener('keyup', listener);
    return () => globalThis.document.removeEventListener('keyup', listener);
  });
};
