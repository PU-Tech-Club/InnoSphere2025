import React, { useState, useEffect } from 'react';

export default function Countdown() {
  // Target date: June 8, 2025
  const target = new Date("2025-06-08T00:00:00").getTime();
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  let diff = target - now;
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-white text-lg font-bold tracking-widest">
        Countdown to June 8:
      </span>
      <div className="flex gap-3 text-xl md:text-3xl font-mono font-bold mt-1 text-white">
        <span>{d}d</span>
        <span>{h}h</span>
        <span>{m}m</span>
        <span>{s}s</span>
      </div>
    </div>
  );
} 