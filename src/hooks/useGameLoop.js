import { useEffect, useRef } from 'react';

/**
 * Custom Hook für den Game Loop.
 * @param {Function} callback - Die Funktion, die in jedem Frame aufgerufen wird.
 * @param {boolean} isActive - Ob der Loop aktiv ist.
 */
export const useGameLoop = (callback, isActive) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      // Wir begrenzen deltaTime, um Sprünge bei Tab-Wechseln zu vermeiden
      callback(Math.min(deltaTime, 100));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, callback]);
};
