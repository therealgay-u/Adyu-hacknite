import React from 'react';

/**
 * RiskBadge component for displaying shipment spoilage risk status.
 * Per COMPONENTS.md:
 * - Pill shape, fully rounded corners
 * - Filled background color: Low (#16A34A), Medium (#D97706), High (#DC2626)
 * - White, bold, uppercase text (12-13px) with letter-spacing
 * - Padding ~4px vertical, 10-12px horizontal
 *
 * @param {Object} props
 * @param {'Low' | 'Medium' | 'High' | string} props.level - The risk level
 * @param {string} [props.className] - Additional CSS classes
 */
export default function RiskBadge({ level = 'Low', className = '' }) {
  const normalizedLevel = (level || 'Low').toString().toLowerCase();

  let bgClass = 'bg-risk-low';
  let labelText = 'LOW RISK';

  if (normalizedLevel === 'high') {
    bgClass = 'bg-risk-high';
    labelText = 'HIGH RISK';
  } else if (normalizedLevel === 'medium' || normalizedLevel === 'med') {
    bgClass = 'bg-risk-medium';
    labelText = 'MEDIUM RISK';
  } else {
    bgClass = 'bg-risk-low';
    labelText = 'LOW RISK';
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${bgClass} ${className}`}
    >
      {labelText}
    </span>
  );
}
