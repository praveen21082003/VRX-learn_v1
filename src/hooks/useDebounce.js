
import { useState, useEffect } from "react";

/**
 * @param {any} value - The state value to debounce
 * @param {number} delay - Delay in ms (default 500ms)
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Clean up: If value changes before delay is over, clear the previous timer
    // This is what prevents the "infinite loop" and "over-firing"
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};