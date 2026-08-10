import React from 'react';
import RiskBadge from './RiskBadge';
import StatField from './StatField';
import Button from './Button';

/**
 * PredictionResult component per updated COMPONENTS.md:
 * - Large <RiskBadge /> + risk_score at top
 * - recommendedAction shown prominently below (18-20px, semi-bold)
 * - explanation rendered if present, 14px muted paragraph
 * - Parameters summary grid displaying all dataset parameters
 *
 * @param {Object} props
 * @param {'Low'|'Medium'|'High'|string} props.riskLevel
 * @param {number} [props.riskScore] - 0-100 numeric score straight from backend
 * @param {string} props.recommendedAction
 * @param {string} [props.explanation]
 * @param {Object} [props.payload] - Original input metrics
 * @param {function} [props.onReset] - Handler to reset form or assess another shipment
 * @param {function} [props.onGoToDashboard] - Handler to navigate back to dashboard
 */
export default function PredictionResult({
  riskLevel = 'Low',
  riskScore,
  recommendedAction = 'Standard route dispatch',
  explanation,
  payload,
  onReset,
  onGoToDashboard,
}) {
  return (
    <div className="bg-surface rounded-card border border-slate-light p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
      {/* Header section with Badge & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-light pb-5">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Spoilage Risk Assessment
          </span>
          <h2 className="text-xl font-bold text-slate-navy mt-1">
            {payload?.produce_type || 'Shipment Batch'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={riskLevel} className="text-sm px-4 py-1.5" />
          {riskScore !== undefined && riskScore !== null && (
            <span className="text-xs font-bold text-slate-navy bg-slate-100 px-3 py-1.5 rounded-btn border border-slate-light">
              Score: {riskScore} / 100
            </span>
          )}
        </div>
      </div>

      {/* Prominent Recommended Action */}
      <div className="bg-slate-50 border border-slate-light rounded-btn p-5 space-y-1.5">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Recommended Action
        </span>
        <p className="text-lg sm:text-xl font-semibold text-slate-navy leading-snug">
          {recommendedAction}
        </p>
      </div>

      {/* Explanation text (rendered if present per COMPONENTS.md) */}
      {explanation && (
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-navy uppercase tracking-wider">
            Assessment Rationale
          </span>
          <p className="text-sm text-text-muted leading-relaxed bg-background p-4 rounded-btn border border-slate-light">
            {explanation}
          </p>
        </div>
      )}

      {/* Input Metrics Summary */}
      {payload && (
        <div className="border-t border-slate-light pt-5 space-y-2">
          <span className="text-xs font-semibold text-slate-navy uppercase tracking-wider block">
            Shipment & Environmental Parameters
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-background p-4 rounded-btn border border-slate-light">
            <StatField label="Temperature" value={`${payload.temperature_c}°C`} />
            <StatField label="Humidity" value={`${payload.humidity_pct}%`} />
            {payload.light_flux !== undefined && (
              <StatField label="Light Flux" value={`${payload.light_flux}`} />
            )}
            {payload.co2_ppm !== undefined && (
              <StatField label="CO2 Concentration" value={`${payload.co2_ppm} ppm`} />
            )}
            <StatField label="Transit Time" value={`${payload.transit_time_hours} hrs`} />
            <StatField label="Distance" value={`${payload.distance_km} km`} />
          </div>
        </div>
      )}

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-light pt-5">
        {onReset && (
          <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto">
            Evaluate Another Batch
          </Button>
        )}
        {onGoToDashboard && (
          <Button variant="primary" onClick={onGoToDashboard} className="w-full sm:w-auto">
            Return to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
