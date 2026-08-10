import React from 'react';

/**
 * StatField component per COMPONENTS.md:
 * Small reusable unit for metrics inside cards and the prediction page.
 * - Label: 12px, muted gray (#64748B)
 * - Value: 14px, dark slate (#1E293B), medium weight
 *
 * @param {Object} props
 * @param {string} props.label - The field label (e.g. "Temperature")
 * @param {string | number} props.value - The metric value (e.g. "24°C")
 * @param {string} [props.className] - Optional container classes
 */
export default function StatField({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-xs font-normal text-text-muted leading-tight">{label}</span>
      <span className="text-sm font-medium text-text-primary leading-tight tabular-nums">
        {value !== undefined && value !== null ? value : '--'}
      </span>
    </div>
  );
}
