import { useEffect, useRef, useState } from "react";

export const useClickOutside = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  const ref = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref exists and the click happened outside of it, close the menu
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Use mousedown to catch the click immediately
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return [isOpen, ref, setIsOpen, toggle];
};