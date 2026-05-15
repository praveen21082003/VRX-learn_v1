import { useEffect, useRef } from 'react';

export const useContentProtection = (enabled = true) => {
    const originalTitle = useRef(document.title);

    useEffect(() => {
        if (!enabled) return;

        // HELPER: Get the root element
        const getRoot = () => document.getElementById('root');

        // Handle Visibility
        const handleVisibilityChange = () => {
            const root = getRoot();
            
            if (document.visibilityState === 'hidden') {
                // Before we change the title to "Paused", 
                // save whatever the CURRENT real title is.
                if (document.title !== "▶ Learning Paused | VRX Learn") {
                    originalTitle.current = document.title;
                }
                document.title = "▶ Learning Paused | VRX Learn";
                root?.classList.add('content-blur');
            } else {
                // Restore the real title
                document.title = originalTitle.current;
                root?.classList.remove('content-blur');
            }
        };

        // LISTENERS
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            const isCtrl = e.ctrlKey || e.metaKey;
            if (
                (isCtrl && (key === 's' || key === 'p' || key === 'u')) ||
                (e.key === 'F12') ||
                (isCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
            ) {
                e.preventDefault();
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleVisibilityChange); // Extra layer of protection
        window.addEventListener('focus', handleVisibilityChange);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
            
            const root = getRoot();
            root?.classList.remove('content-blur');
            document.title = originalTitle.current;
        };
    }, [enabled]);
};