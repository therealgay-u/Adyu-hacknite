import React from 'react';
import RiskBadge from './RiskBadge';
import StatField from './StatField';
import SpoilageCountdown from './SpoilageCountdown';
import RescueMarketplace from './RescueMarketplace';

/**
 * Enhanced ShipmentCard & StockCard component per requirements:
 * - Top: Produce/flower type (16px semi-bold) + RiskBadge top-right
 * - High risk: renders <SpoilageCountdown riskScore /> near the badge
 * - rescueEligible === true: renders BOTH routing recommendation card AND <RescueMarketplace /> together
 * - recommended_action includes "Prioritize dispatch": shows urgency countdown, NO routing or rescue card
 * - Medium/Low risk: renders plain recommended_action text, NO special card
 *
 * @param {Object} props
 */
export default function ShipmentCard({
  id,
  produceType = 'Produce Batch',
  riskLevel = 'Low',
  riskScore = 20.0,
  temperature = 0,
  humidity = 0,
  transitTime = 0,
  distance = 0,
  recommendedAction = 'Standard dispatch',
  candidateWarehouseName,
  candidateDistanceKm,
  candidateTransitHours,
  rescueEligible = false,
  stockId,
  onClick,
}) {
  const formattedTemp = typeof temperature === 'number' ? `${temperature}°C` : temperature;
  const formattedHumidity = typeof humidity === 'number' ? `${humidity}%` : humidity;
  const formattedTransit = typeof transitTime === 'number' ? `${transitTime} hrs` : transitTime;
  const formattedDistance = typeof distance === 'number' ? `${distance} km` : distance;

  const isRescue =
    rescueEligible || (recommendedAction && recommendedAction.toLowerCase().includes('rescue'));

  const isPrioritizeDispatch =
    !isRescue &&
    recommendedAction &&
    recommendedAction.toLowerCase().includes('prioritize dispatch');

  const isHighRisk = (riskLevel || '').toLowerCase() === 'high' || Number(riskScore) >= 75;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-between rounded-card border border-slate-light bg-surface transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header: Produce Type + Risk Badge + Spoilage Countdown */}
      <div className="p-4 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            {id && <span className="block text-[11px] text-text-muted font-mono mb-0.5">{id}</span>}
            <h3 className="text-base font-semibold text-slate-navy leading-snug">{produceType}</h3>
          </div>
          <RiskBadge level={riskLevel} className="shrink-0" />
        </div>

        {/* Live Spoilage Countdown for High Risk */}
        {isHighRisk && (
          <div className="pt-1">
            <SpoilageCountdown riskScore={riskScore} riskLevel={riskLevel} />
          </div>
        )}
      </div>

      {/* Body: Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 px-4 py-2.5 border-t border-slate-light/60 bg-slate-50/40">
        <StatField label="Temp" value={formattedTemp} />
        <StatField label="Humidity" value={formattedHumidity} />
        <StatField label="Transit Time" value={formattedTransit} />
        <StatField label="Distance" value={formattedDistance} />
      </div>

      {/* Conditional Cards & Action Display */}
      <div className="border-t border-slate-light p-4 bg-slate-50/80 rounded-b-card space-y-3">
        {/* CASE 1: Rescue Eligible -> Show BOTH Candidate Routing Card AND RescueMarketplace Card */}
        {isRescue && (
          <div className="space-y-3">
            {/* Routing Recommendation Card */}
            <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-btn text-xs space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-navy">
                <span>📍</span>
                <span>Safe Routing Target</span>
              </div>
              <p className="text-slate-700 font-medium">
                {candidateWarehouseName ? (
                  <>
                    Redirect candidate: <strong className="text-slate-navy">{candidateWarehouseName}</strong> ({candidateDistanceKm || distance} km • {candidateTransitHours || transitTime} hrs travel)
                  </>
                ) : (
                  <>
                    No safe candidate warehouse available within reach. Direct rescue required.
                  </>
                )}
              </p>
            </div>

            {/* Rescue Marketplace Card */}
            <RescueMarketplace
              stockId={stockId}
              stock={{
                id: stockId || id,
                produce_type: produceType,
                rescueEligible: true,
                recommended_action: recommendedAction,
              }}
            />
          </div>
        )}

        {/* CASE 2: "Prioritize dispatch immediately" -> Urgency banner, NO routing/rescue card */}
        {isPrioritizeDispatch && (
          <div>
            <span className="block text-xs font-semibold text-amber-800 mb-0.5">Urgent Dispatch Recommendation</span>
            <p className="text-xs font-medium text-slate-navy leading-tight">{recommendedAction}</p>
          </div>
        )}

        {/* CASE 3: Low/Medium Risk -> Plain recommended_action text */}
        {!isRescue && !isPrioritizeDispatch && (
          <div>
            <span className="block text-xs font-normal text-text-muted mb-0.5">Recommended Action</span>
            <p className="text-xs font-medium text-slate-navy leading-tight line-clamp-2">
              {recommendedAction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
