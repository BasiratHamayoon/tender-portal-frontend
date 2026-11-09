"use client";

import { useEffect, useState } from "react";

export default function LineLoader({ loading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(239,68,68,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}