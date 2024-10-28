'use client';

import { useState, useEffect } from 'react';
import './Game.css';
import Square from '../mines/Square/Square'

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomMines() {
  let randomNumbers: number[] = [];
  while (randomNumbers.length < 3) {
    let randomNumber = getRandomInt(1, 25);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }
  return randomNumbers;
}

const mines = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(100);
  const [gameState, setGameState] = useState('start'); 
  const [randomNumbers, setRandomNumbers] = useState<number[]>(generateRandomMines());
  const [resetKey, setResetKey] = useState(0);

  let items = [];

  for (let index = 1; index < 26; index++) {
    items.push(
      <Square
        setScore={setScore}
        gameOver={gameOver}
        setGameOver={setGameOver}
        mine={randomNumbers.includes(index)}
        key={`${resetKey}-${index}`}
        disabled={gameState !== 'running'} 
      />
    );
  }

  useEffect(() => {
    if (gameOver && gameState === 'running') {
      handleSaveResult();
      setGameState('end'); 
    }
  }, [gameOver, gameState]);

  const handleGameStart = () => {
    console.log('Approving tokens...');
    setGameState('running');
  };

  const handleSaveResult = () => {
    const result = gameOver ? 'lost' : 'won';
    console.log(`Saving result: ${result}, Score: ${score}`);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setScore(100);
    setGameState('start'); 
    setRandomNumbers(generateRandomMines());
    setResetKey(prevKey => prevKey + 1); 
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-semibold mb-2">Total Score</h2>
        <p className="text-xl text-gray-600 font-bold">{score} PTS</p>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {items}
      </div>
      <div className="flex gap-4">
        {(gameState === 'start' || gameState === 'end') && (
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={gameState === 'start' ? handleGameStart : handlePlayAgain}
          >
            {gameState === 'start' ? 'Play' : 'Play Again'}
          </button>
        )}
      </div>
    </div>
  );
}

export default mines;
