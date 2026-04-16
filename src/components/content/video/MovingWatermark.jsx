import React, { useEffect, useRef } from 'react';

const MovingWatermark = ({ text = "PROTECTED" }) => {
  const watermarkRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  
  const pos = useRef({ x: Math.random() * 100, y: Math.random() * 100 });
  const vel = useRef({ dx: 1.2, dy: 1.2 });
  const lastJump = useRef(Date.now());

  useEffect(() => {
    let containerRect = containerRef.current?.getBoundingClientRect();
    let watermarkRect = watermarkRef.current?.getBoundingClientRect();

    const handleResize = () => {
      containerRect = containerRef.current?.getBoundingClientRect();
      watermarkRect = watermarkRef.current?.getBoundingClientRect();
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!watermarkRef.current || !containerRect || !watermarkRect) return;

      // --- RANDOM JUMP LOGIC (Every 60s) ---
      const now = Date.now();
      if (now - lastJump.current > 60000) { 
        pos.current.x = Math.random() * (containerRect.width - watermarkRect.width);
        pos.current.y = Math.random() * (containerRect.height - watermarkRect.height);
        lastJump.current = now;
      }

      // --- MOVEMENT LOGIC ---
      pos.current.x += vel.current.dx;
      pos.current.y += vel.current.dy;

      if (pos.current.x + watermarkRect.width >= containerRect.width || pos.current.x <= 0) {
        vel.current.dx *= -1;
      }
      if (pos.current.y + watermarkRect.height >= containerRect.height || pos.current.y <= 0) {
        vel.current.dy *= -1;
      }

      watermarkRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(requestRef.current);
      else requestRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      <div
        ref={watermarkRef}
        className="absolute whitespace-nowrap text-white text-[10px] font-mono bg-black/30 px-2 py-1 rounded will-change-transform"
      >
        {text}
      </div>
    </div>
  );
};

export default MovingWatermark;