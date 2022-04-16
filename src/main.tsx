import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GameProvider } from './GameProvider';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <GameProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root'),
);
