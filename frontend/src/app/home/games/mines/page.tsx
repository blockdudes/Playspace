'use client';

import { useState, useEffect } from 'react';
import './Game.css';
import Square from '../mines/Square/Square'
import { approveTokens, transferFromTokens } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { connectWallet } from '@/lib/reducers/integrate_wallet_slice';
import { getUserData } from '@/lib/reducers/user_data_slice';
import { adminClient } from '@/admin/signer';
import axios from 'axios';

// Define gameState to include 'running' as a possible value
type GameState = 'start' | 'end' | 'running';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomMines() {
  const randomNumbers: number[] = [];
  while (randomNumbers.length < 3) {
    const randomNumber = getRandomInt(1, 25);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }
  return randomNumbers;
}

const Mines = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(100);
  const [gameState, setGameState] = useState<GameState>('start');
  const [randomNumbers, setRandomNumbers] = useState<number[]>(generateRandomMines());
  const [resetKey, setResetKey] = useState(0);
  const wallet = useAppSelector(state => state.wallet);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [isApproving, setIsApproving] = useState(false);

  const items = Array.from({ length: 25 }, (_, index) => (
    <Square
      setScore={setScore}
      gameOver={gameOver}
      setGameOver={setGameOver}
      mine={randomNumbers.includes(index + 1)}
      key={`${resetKey}-${index + 1}`}
      disabled={gameState !== 'running'}
    />
  ));

  useEffect(() => {
    if (gameOver && gameState === 'running') {
      handleSaveResult();
      setGameState('end');
    }
  }, [gameOver, gameState]);

  useEffect(() => {
    dispatch(connectWallet());
  }, []);

  useEffect(() => {
    if (wallet.signer) {
      dispatch(getUserData(wallet.signer));
    }
  }, [wallet]);

  const handleGameStart = async () => {
    setIsApproving(true);
    try {
      await approveTokens(10, wallet);
      setGameState('running');
      setIsApproving(false);
    } catch (error) {
      console.error('Approval failed:', error);
      setIsApproving(false);
    }
  };

  const handleSaveResult = async () => {
    const result = gameOver ? 'lost' : 'won';
    console.log(`Saving result: ${result}, Score: ${score}`);
    let resultData: any;

    if (score >= 1000) {
      resultData = {
        reward: score,
        game: "671f4d3a0a719482329b99e6",
        player: user?.user?._id,
        result: "WIN",
        timePassed: 0,
        gambleAmount: 10
      };
    } else {
      await transferFromTokens(10, wallet, adminClient);

      resultData = {
        reward: 0,
        game: "671f4d3a0a719482329b99e6",
        player: user?.user?._id,
        result: "LOSS",
        timePassed: 0,
        gambleAmount: 10
      };
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/store/rewards`, resultData);
  };

  const handlePlayAgain = async () => {
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
            disabled={(gameState as GameState) === 'running' || isApproving}
          >
            {isApproving ? 'Approving...' : (gameState === 'start' ? 'Play' : 'Play Again')}
          </button>
        )}
      </div>
    </div>
  );
}

export default Mines;
