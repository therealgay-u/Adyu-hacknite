import React from 'react';

/**
 * WhatIfSlider component per COMPONENTS.md:
 * - Track: light slate; filled portion: slate navy; thumb: slate navy
 * - Label + live value shown above/beside the slider (e.g. "Transit Time: 6.5 hrs")
 *
 * @param {Object} props
 * @param {string} props.label - Metric name (e.g. "Temperature")
 * @param {number} props.value - Current slider value
 * @param {number} props.min - Minimum slider bound
 * @param {number} props.max - Maximum slider bound
 * @param {number} [props.step=1] - Incremental step size
 * @param {string} [props.unit=''] - Unit suffix (e.g. "°C", "%", "hrs", "km")
 * @param {function(number): void} props.onChange - Callback when value changes
 * @param {string} [props.id] - Element ID
 */
export default function WhatIfSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  id,
}) {
  const sliderId = id || `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && onChange) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2 bg-surface p-4 rounded-btn border border-slate-light shadow-xs">
      <div className="flex items-center justify-between">
        <label htmlFor={sliderId} className="text-xs font-semibold text-slate-navy">
          {label}
        </label>
        <span className="text-xs font-bold text-slate-navy bg-slate-100 px-2.5 py-0.5 rounded-btn border border-slate-light tabular-nums">
          {value} {unit}
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-slate-light rounded-lg appearance-none cursor-pointer accent-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy/20"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-muted font-medium px-0.5">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}
