import { useCallback } from "react";

export const useScrollToError = (refsMap) => {
    const scrollToError = useCallback((errors) => {
        if (!errors || Object.keys(errors).length === 0) return;

        const firstErrorField = Object.keys(errors)[0];
        const ref = refsMap[firstErrorField];

        if (ref?.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // optional focus
            const input = ref.current.querySelector("input, textarea");
            input?.focus();
        }
    }, [refsMap]);

    return scrollToError;
};