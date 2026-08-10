import React from 'react';
import RiskBadge from './RiskBadge';
import StatField from './StatField';

/**
 * ShipmentCard component per COMPONENTS.md:
 * - White surface (#FFFFFF), border #E2E8F0, border-radius ~8px
 * - No shadow at rest; soft shadow on hover
 * - Top: Produce/flower type (16px, semi-bold) + RiskBadge top-right
 * - Middle: Key metrics as small labeled stats (temp, humidity, transit time, distance)
 * - Bottom: Recommended action at bottom, visually distinct slate tag
 *
 * @param {Object} props
 * @param {string} [props.id] - Optional batch/shipment identifier
 * @param {string} props.produceType - Produce or flower name (e.g. "Tomatoes", "Jasmine Flowers")
 * @param {'Low'|'Medium'|'High'} props.riskLevel - Spoilage risk level
 * @param {number|string} props.temperature - Temp in °C
 * @param {number|string} props.humidity - Humidity in %
 * @param {number|string} props.transitTime - Remaining transit time in hours
 * @param {number|string} props.distance - Transit distance in km
 * @param {string} props.recommendedAction - Action recommendation text
 * @param {function} [props.onClick] - Optional click handler for details view
 */
export default function ShipmentCard({
  id,
  produceType = 'Produce Batch',
  riskLevel = 'Low',
  temperature = 0,
  humidity = 0,
  transitTime = 0,
  distance = 0,
  recommendedAction = 'Standard dispatch',
  onClick,
}) {
  const formattedTemp = typeof temperature === 'number' ? `${temperature}°C` : temperature;
  const formattedHumidity = typeof humidity === 'number' ? `${humidity}%` : humidity;
  const formattedTransit = typeof transitTime === 'number' ? `${transitTime} hrs` : transitTime;
  const formattedDistance = typeof distance === 'number' ? `${distance} km` : distance;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-between rounded-card border border-slate-light bg-surface transition-shadow duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header: Produce Type + Risk Badge */}
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div>
          {id && <span className="block text-xs text-text-muted font-normal mb-0.5">{id}</span>}
          <h3 className="text-base font-semibold text-slate-navy leading-snug">{produceType}</h3>
        </div>
        <RiskBadge level={riskLevel} className="shrink-0" />
      </div>

      {/* Body: Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 px-4 py-2 border-t border-slate-light/60 bg-slate-50/40">
        <StatField label="Temp" value={formattedTemp} />
        <StatField label="Humidity" value={formattedHumidity} />
        <StatField label="Transit Time" value={formattedTransit} />
        <StatField label="Distance" value={formattedDistance} />
      </div>

      {/* Footer: Recommended Action */}
      <div className="border-t border-slate-light px-4 py-3 bg-slate-50/80 rounded-b-card">
        <span className="block text-xs font-normal text-text-muted mb-0.5">Recommended Action</span>
        <p className="text-xs font-medium text-slate-navy leading-tight line-clamp-2">
          {recommendedAction}
        </p>
      </div>
    </div>
  );
}
