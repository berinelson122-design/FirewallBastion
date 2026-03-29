import { useEffect, useRef } from 'react';

/**
 * useGameLoop binds a tick function to native requestAnimationFrame.
 * This guarantees max frame-rate logic disconnected from React's render cycles.
 */
export const useGameLoop = (callback: (deltaTime: number, timestamp: number) => void, isRunning: boolean) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime, time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined; // reset on stop
    }
  }, [isRunning, callback]);
};
