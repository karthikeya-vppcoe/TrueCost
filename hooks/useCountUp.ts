import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const useCountUp = (end: number, duration = 2000, start = 0): number => {
  const [count, setCount] = useState(start);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const counterRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const countTo = end;

    const counter = () => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const currentCount = Math.round(start + (countTo - start) * progress);
      
      if (frame >= totalFrames) {
        setCount(countTo);
        if (counterRef.current) {
            cancelAnimationFrame(counterRef.current);
        }
        return;
      }

      setCount(currentCount);
      counterRef.current = requestAnimationFrame(counter);
    };

    counterRef.current = requestAnimationFrame(counter);

    return () => {
        if (counterRef.current) {
            cancelAnimationFrame(counterRef.current);
        }
    };
  }, [end, duration, start]);

  return count;
};

export default useCountUp;
