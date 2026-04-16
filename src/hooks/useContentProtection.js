import { useEffect } from 'react';

export const useContentProtection = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        // 1. Block Right-Click (Context Menu)
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            // Block Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
            // Block Ctrl+Shift+I / F12 (Inspect Element)
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
                e.key === 'F12' || e.ctrlKey
            ) {
                e.preventDefault();
                return false;
            }
        };

        // 3. Deter Print Screen (Blur content when window loses focus)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                document.title = "Protected Content";
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled]);
};