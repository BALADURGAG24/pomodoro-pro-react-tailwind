import React from "react";

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function TimerDisplay({ label, timeLeft, percent }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2">{label}</h2>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="opacity-10"
          />
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - percent)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
}
