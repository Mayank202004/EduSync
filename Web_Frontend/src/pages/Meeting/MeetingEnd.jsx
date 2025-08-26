import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MeetingEnded() {
  const location = useLocation();
  const navigate = useNavigate();

  const reason = location.state?.reason || "You left the meeting";
  const duration = 60; // seconds

  const [counter, setCounter] = useState(duration);

  useEffect(() => {
    if (counter <= 0) {
      navigate("/"); // auto go home
      return;
    }
    const timer = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter, navigate]);

  // circle config
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = ((duration - counter) / duration) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* Countdown top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-gray-600">
        <svg
          className="w-12 h-12"
          viewBox="0 0 50 50"
        >
          {/* Background circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="gray"
            strokeWidth="4"
            fill="none"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="blue"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          {/* Counter text in middle */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            fontSize="12"
            fill="blue"
          >
            {counter}
          </text>
        </svg>
        <span className="text-sm">Returning to home</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">{reason}</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          Rejoin
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
