import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const Spinner = forwardRef(({ onFinish, timer }: { onFinish: (position: number) => void, timer: number }, ref) => {
  const [position, setPosition] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timer);
  const iconHeight = 188;
  const multiplier = Math.floor(Math.random() * (4 - 1) + 1);
  const speed = iconHeight * multiplier;
  const totalSymbols = 9;
  const maxPosition = iconHeight * (totalSymbols - 1) * -1;
  const start = useRef(((Math.floor(Math.random() * 9)) * iconHeight) * -1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    reset() {
      clearInterval(timerRef.current as NodeJS.Timeout);
      start.current = ((Math.floor(Math.random() * 9)) * iconHeight) * -1;
      setPosition(start.current);
      setTimeRemaining(timer);
      timerRef.current = setInterval(tick, 100);
    }
  }));

  const tick = () => {
    if (timeRemaining <= 0) {
      clearInterval(timerRef.current as NodeJS.Timeout);
      getSymbolFromPosition();
    } else {
      moveBackground();
    }
  };

  const moveBackground = () => {
    setPosition(prev => {
      const nextPosition = prev - speed;
      return nextPosition < maxPosition ? maxPosition : nextPosition;
    });
    setTimeRemaining(prev => prev - 100);
  };

  const getSymbolFromPosition = () => {
    let currentPosition = position;
    onFinish(Math.abs(currentPosition / iconHeight) % totalSymbols);
  };

  useEffect(() => {
    timerRef.current = setInterval(tick, 100);
    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    };
  }, []);

  return (
    <div
      className="w-32 h-40 bg-cover icons"
      style={{
        backgroundImage: 'url(https://andyhoffman.codes/random-assets/img/slots/sprite5.png)',
        backgroundPosition: `0px ${position}px`
      }}
    />
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
