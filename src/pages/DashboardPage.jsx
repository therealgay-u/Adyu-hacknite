import React from 'react';
import ShipmentCard from '../components/ShipmentCard';
import Button from '../components/Button';
import { INITIAL_MOCK_SHIPMENTS } from '../services/predictService';

/**
 * DashboardPage component per requirements:
 * - 3-col card grid of <ShipmentCard /> from 4-5 mock shipments
 * - Includes flowers (rose/marigold/jasmine) and vegetables
 * - Provides quick navigation to register new shipment or view prediction results
 *
 * @param {Object} props
 * @param {Array} [props.shipments] - Custom shipments list or default mock data
 * @param {function(Object): void} [props.onSelectShipment] - Callback when card is clicked
 * @param {function(): void} [props.onNavigateToForm] - Callback to open shipment form
 */
export default function DashboardPage({
  shipments = INITIAL_MOCK_SHIPMENTS,
  onSelectShipment,
  onNavigateToForm,
}) {
  const highRiskCount = shipments.filter((s) => (s.riskLevel || '').toLowerCase() === 'high').length;
  const mediumRiskCount = shipments.filter((s) => (s.riskLevel || '').toLowerCase() === 'medium').length;
  const lowRiskCount = shipments.filter((s) => (s.riskLevel || '').toLowerCase() === 'low').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-5 rounded-card border border-slate-light shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-navy">Active Perishable Shipments</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitoring cold-chain status for vegetables and floriculture (roses, jasmine, marigold) in transit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Summary counters */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-btn bg-background border border-slate-light">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-high"></span>
            <span>{highRiskCount} High</span>
            <span className="text-slate-light">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-risk-medium"></span>
            <span>{mediumRiskCount} Med</span>
            <span className="text-slate-light">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-risk-low"></span>
            <span>{lowRiskCount} Low</span>
          </div>

          {onNavigateToForm && (
            <Button variant="primary" onClick={onNavigateToForm} className="text-xs py-2">
              + New Batch Assessment
            </Button>
          )}
        </div>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            id={shipment.id}
            produceType={shipment.produceType}
            riskLevel={shipment.riskLevel}
            temperature={shipment.temperature}
            humidity={shipment.humidity}
            transitTime={shipment.transitTime}
            distance={shipment.distance}
            recommendedAction={shipment.recommendedAction}
            onClick={() => onSelectShipment && onSelectShipment(shipment)}
          />
        ))}
      </div>
    </div>
  );
}
