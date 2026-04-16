import { useEffect } from "react";

function useScrollIndicator(ref, options = {}) {
  const { delay = 800, className = "scrolling" } = options;

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    let timeout;

    const showScrollbar = () => {
      el.classList.add(className);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.classList.remove(className);
      }, delay);
    };

    const handleScroll = () => {
      showScrollbar();
    };

    const handleMouseEnter = () => {
      el.classList.add(className);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        el.classList.remove(className);
      }, delay);
    };

    el.addEventListener("scroll", handleScroll);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [ref, delay, className]);
}

export default useScrollIndicator;