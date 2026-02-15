import React, { useState, useCallback, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import { useGameLoop } from './hooks/useGameLoop';
import { updateBird, updatePipes, createPipe, PHYSICS } from './logic/physics';
import { checkCollision } from './logic/collisions';

const GAME_STATE = {
  START: 'START',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappyHighScore') || '0');
  });

  const [bird, setBird] = useState({ y: 300, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [lastPipeTime, setLastPipeTime] = useState(0);

  // Spiel zurücksetzen
  const resetGame = () => {
    setBird({ y: 300, velocity: 0 });
    setPipes([]);
    setScore(0);
    setLastPipeTime(0);
    setGameState(GAME_STATE.PLAYING);
  };

  // Sprung-Aktion
  const jump = useCallback(() => {
    if (gameState === GAME_STATE.PLAYING) {
      setBird(prev => ({ ...prev, velocity: PHYSICS.JUMP_STRENGTH }));
    } else if (gameState === GAME_STATE.START || gameState === GAME_STATE.GAME_OVER) {
      resetGame();
    }
  }, [gameState]);

  // Tastatur- und Klick-Events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jump();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Haupt-Update-Zyklus
  const update = useCallback((deltaTime) => {
    if (gameState !== GAME_STATE.PLAYING) return;

    // Bird Update
    setBird(prevBird => {
      const nextBird = updateBird(prevBird, deltaTime);

      // Kollision prüfen
      if (checkCollision(nextBird, pipes, 600)) {
        setGameState(GAME_STATE.GAME_OVER);
        return prevBird;
      }
      return nextBird;
    });

    // Pipes Update
    setPipes(prevPipes => {
      const updatedPipes = updatePipes(prevPipes, deltaTime);

      // Score-Logik
      updatedPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + 60 < PHYSICS.BIRD_X) {
          pipe.passed = true;
          setScore(s => s + 1);
        }
      });

      return updatedPipes;
    });

    // Pipe Spawning
    setLastPipeTime(prevTime => {
      const newTime = prevTime + deltaTime;
      if (newTime > PHYSICS.PIPE_SPAWN_RATE) {
        setPipes(prev => [...prev, createPipe(600)]);
        return 0;
      }
      return newTime;
    });

  }, [gameState, pipes]);

  useGameLoop(update, gameState === GAME_STATE.PLAYING);

  // Highscore speichern
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyHighScore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="app-container" onClick={jump}>
      <h1 className="title">Flappy React</h1>

      <div className="game-wrapper">
        <GameCanvas
          bird={bird}
          pipes={pipes}
          gameState={gameState}
          score={score}
        />

        {gameState === GAME_STATE.START && (
          <div className="overlay">
            <h2>Bereit?</h2>
            <p>Drücke Leertaste oder Klicke zum Starten</p>
            <button className="start-btn">START</button>
          </div>
        )}

        {gameState === GAME_STATE.GAME_OVER && (
          <div className="overlay">
            <h2 className="game-over-text">GAME OVER</h2>
            <div className="stats">
              <p>Score: {score}</p>
              <p>Bester: {highScore}</p>
            </div>
            <button className="start-btn" onClick={(e) => { e.stopPropagation(); resetGame(); }}>
              NOCHMAL
            </button>
          </div>
        )}
      </div>

      <div className="controls-hint">
        Klicke oder nutze [Leertaste], um zu fliegen!
      </div>
    </div>
  );
}

export default App;
