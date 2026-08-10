import React, { useState, useEffect } from 'react';

/**
 * SpoilageCountdown component per STEP 5:
 * - Displays static estimated hours-remaining derived from riskScore.
 * - Live-ticking countdown (setInterval decrementing display only, no re-fetching).
 * - Renders ONLY for High-risk stock (riskScore >= 75 or riskLevel === 'High').
 *
 * @param {Object} props
 * @param {number} props.riskScore - Risk score (0-100)
 * @param {string} [props.riskLevel] - Optional explicit risk level ('Low' | 'Medium' | 'High')
 * @param {string} [props.className] - Additional wrapper styling classes
 */
export default function SpoilageCountdown({ riskScore, riskLevel, className = '' }) {
  // Render ONLY for High-risk stock
  const isHighRisk = (riskLevel && riskLevel === 'High') || (riskScore !== undefined && Number(riskScore) >= 75);

  if (!isHighRisk) {
    return null;
  }

  const score = Number(riskScore) || 75;

  // Derives estimated initial remaining seconds from riskScore
  // Higher score = fewer hours remaining (e.g. 75 => 2.5h, 95 => 30m)
  const calculateInitialSeconds = (val) => {
    const hours = Math.max(0.25, (100 - Math.min(99, val)) * 0.1); // e.g. score 75 = 2.5 hrs, score 90 = 1.0 hr
    return Math.round(hours * 3600);
  };

  const [secondsLeft, setSecondsLeft] = useState(() => calculateInitialSeconds(score));

  // Reset seconds countdown if riskScore prop changes significantly
  useEffect(() => {
    setSecondsLeft(calculateInitialSeconds(score));
  }, [score]);

  // Live decrement ticker (display only)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-btn bg-coral-light/80 border border-coral/30 text-coral-dark text-xs font-mono font-bold shadow-sm ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-dark"></span>
      </span>
      <span>
        Spoilage in: {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </div>
  );
}
