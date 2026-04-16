import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcutMap, dependencies = []) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      const action = shortcutMap[key] || shortcutMap[e.key];

      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, dependencies); 
};