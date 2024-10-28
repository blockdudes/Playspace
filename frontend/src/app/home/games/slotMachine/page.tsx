'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './SlotMachine.css';

type SpinnerProps = {
  onStart: boolean;
  onFinish: (position: number) => void;
  timer: number;
};

const iconHeight = 188;

const Spinner: React.FC<SpinnerProps> = ({ onStart, onFinish, timer }) => {
    const [position, setPosition] = useState(0);
    const timerRef = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
      if (onStart) {
        const startPosition = ((Math.floor(Math.random() * 9)) * iconHeight) * -1;
        setPosition(startPosition);
        let timeRemaining = timer;

        timerRef.current = setInterval(() => {
          if (timeRemaining <= 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            onFinish(Math.abs(startPosition) / iconHeight); // Convert negative position to an index
          } else {
            setPosition(prevPosition => prevPosition - iconHeight);
            timeRemaining -= 100;
          }
        }, 100);
      }

      return () => {
        if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout);
      };
    }, [onStart, timer, onFinish]);

    return (
      <div style={{ backgroundPosition: `0px ${position}px`, minHeight: '188px', border: '1px solid white' }} className="icons" />
    );
};

const SlotMachine: React.FC = () => {
    const [winner, setWinner] = useState<boolean | null>(null);
    const [startGame, setStartGame] = useState<boolean>(false);
    const [gameKey, setGameKey] = useState<number>(0);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const matches = useRef<number[]>([]);
  
    async function handleStart() {
        const checkApproval = true;
        if (checkApproval) {
          setWinner(null);
          matches.current = [];
          setStartGame(true);
          setIsSpinning(true);
          setGameKey(prevKey => prevKey + 1);
        } else {
          alert('Wallet approval needed or insufficient funds');
        }
      }

      function finishHandler(value: number) {
        matches.current.push(value);
        if (matches.current.length === 3) {
          const allEqual = matches.current.every(val => val === matches.current[0]);
          setWinner(allEqual);
          setIsSpinning(false); 
          setStartGame(false);
          saveGameResult(allEqual);
        }
      }

      async function saveGameResult(win: boolean) {
        console.log(`Result saved: ${win ? 'Win' : 'Loss'}`);
      }

    function getLoserMessage() {
      const loserMessages = [
        'Not quite', 'Stop gambling', 'Hey, you lost!', 'Ouch! I felt that',
        'Don\'t beat yourself up', 'There goes the college fund',
        'I have a cat. You have a loss', 'You\'re awesome at losing',
        'Coding is hard', 'Don\'t hate the coder'
      ];
      return loserMessages[Math.floor(Math.random() * loserMessages.length)];
    }

    return (
      <div style={{ color: 'white', height: '80vh', position: 'relative' }}>
        {isSpinning && <audio autoPlay loop className="spinning-sound" preload="auto">
          <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" type="audio/mp3" />
        </audio>}
        {winner && <audio autoPlay className="player" preload="false">
          <source src="/Sound/win.mp3" />
        </audio>}
        {winner === false && <audio autoPlay className="loss-sound" preload="auto">
          <source src="/Sound/loss.mp3" type="audio/mp3" />
        </audio>}
        <div className="w-full flex justify-center items-center mt-10">
        <h1>
          <span>{winner === null ? 'Try your luck!' : winner ? '🤑 Pure skill! 🤑' : getLoserMessage()}</span>
        </h1>
        </div>
        <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spinner key={gameKey * 3 - 2} onStart={startGame} onFinish={finishHandler} timer={1000} />
          <Spinner key={gameKey * 3 - 1} onStart={startGame} onFinish={finishHandler} timer={1400} />
          <Spinner key={gameKey * 3} onStart={startGame} onFinish={finishHandler} timer={2200} />
        </div>
        <div className="h-[80%] w-full flex justify-center items-end">
          <button aria-label="Start Game" className='bg-blue-500 text-white p-2 rounded-lg border-2' onClick={handleStart}>{winner !== null ? 'Play Again' : 'Start Game'}</button>
        </div>
      </div>
    );
  };

export default SlotMachine;
