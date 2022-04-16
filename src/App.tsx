import './App.css';
import { Contestant } from './components/Contestant';
import { Round } from './components/Round';
import { useGameData, useGameStatus } from './hooks/game';
import { Contestant as ContestantType } from './types';

function Contestants({ contestants, horizontal }: { horizontal?: boolean; contestants: ContestantType[] }) {
  return (
    <div className={`contestants ${horizontal ? 'horizontal' : ''}`}>
      {contestants.map((contestant) => (
        <Contestant key={contestant.name} large={horizontal} {...contestant} />
      ))}
    </div>
  );
}

function App() {
  const loaded = useGameStatus();
  const { currentRound, style: gameStyle, name: gameName, currentQuestion, contestants, round } = useGameData();
  const numRounds = 3;
  let winner = undefined;
  const view = 'game';
  console.log('ROUND', round);

  return (
    <>
      {loaded ? (
        <div className={`root ${gameStyle}`}>
          <div className="header">
            <h1 className={`title ${gameStyle}`}>{gameName}</h1>
            {!winner && (
              <button
                className="round"
                disabled={currentRound >= numRounds - 1}
                onClick={() => {
                  // set current round
                }}
              >
                <div className="roundNumber">Round {String(currentRound + 1)}</div>
                <div>{round?.name}</div>
              </button>
            )}
          </div>
          {winner ? (
            <div key="winner-view" className="winner">
              <h1>Winner</h1>
              <Contestant {...winner} />
            </div>
          ) : view === 'game' ? (
            <div key="game-view" className="gameWrapper">
              <Round final={round.format === 'standard'} round={round} currentQuestion={currentQuestion} />
              <Contestants contestants={contestants} />
            </div>
          ) : (
            <Contestants key="contestants-view" horizontal contestants={contestants} />
          )}
        </div>
      ) : (
        <>LOADING</>
      )}
    </>
  );
}

export default App;
