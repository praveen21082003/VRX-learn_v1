import { useState, useEffect, useRef } from "react";

export const useResizable = (initialWidth, minWidth = 280, maxWidth = 500) => {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false); // State for UI/Color
    const isResizingRef = useRef(false); // Ref for performance

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizingRef.current) return;
            const newWidth = e.clientX;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            setIsResizing(false);
            document.body.style.userSelect = "auto";
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [minWidth, maxWidth]);

    const startResizing = () => {
        isResizingRef.current = true;
        setIsResizing(true);
        document.body.style.userSelect = "none";
    };

    return { width, isResizing, startResizing };
};