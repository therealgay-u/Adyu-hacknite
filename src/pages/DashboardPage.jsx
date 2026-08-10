import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import ShipmentCard from '../components/ShipmentCard';
import RiskRadar from '../components/RiskRadar';
import Button from '../components/Button';
import { INITIAL_MOCK_SHIPMENTS } from '../services/predictService';

/**
 * DashboardPage component per requirements:
 * - RiskRadar SVG network map displayed at top of Dashboard
 * - View switcher between Warehouse Storage Stocks and Active Transit Shipments
 * - Cards display SpoilageCountdown, candidate routing, and RescueMarketplace based on rules
 * - Quick "Demo Calamity" trigger button for reliable on-cue demoing
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
  const { warehouses, stocks, triggerCalamity } = useWarehouse();

  const [activeView, setActiveView] = useState('stocks'); // 'stocks' | 'transit'
  const [selectedCalamityWh, setSelectedCalamityWh] = useState(warehouses[2]?.id || 'WH-HOS-05');

  // Combined metrics calculation
  const allItems = activeView === 'stocks' ? stocks : shipments;

  const highRiskCount = allItems.filter(
    (item) => ((item.risk_level || item.riskLevel) || '').toLowerCase() === 'high'
  ).length;

  const mediumRiskCount = allItems.filter(
    (item) => ((item.risk_level || item.riskLevel) || '').toLowerCase() === 'medium'
  ).length;

  const lowRiskCount = allItems.filter(
    (item) => ((item.risk_level || item.riskLevel) || '').toLowerCase() === 'low'
  ).length;

  const handleTriggerCalamityClick = () => {
    if (selectedCalamityWh) {
      triggerCalamity(selectedCalamityWh);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-5 rounded-card border border-slate-light shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-navy">Perishable Supply Chain Control Tower</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Continuous environmental monitoring for wholesale produce & floriculture (roses, marigold, jasmine).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Summary counters */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-btn bg-background border border-slate-light">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-high animate-pulse"></span>
            <span>{highRiskCount} High</span>
            <span className="text-slate-300">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-risk-medium"></span>
            <span>{mediumRiskCount} Med</span>
            <span className="text-slate-300">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-risk-low"></span>
            <span>{lowRiskCount} Low</span>
          </div>

          {/* Calamity Demo Trigger */}
          <div className="flex items-center gap-1.5 bg-red-50/80 p-1.5 rounded-btn border border-red-200">
            <select
              value={selectedCalamityWh}
              onChange={(e) => setSelectedCalamityWh(e.target.value)}
              className="text-xs h-8 px-2 rounded-btn bg-white border border-red-300 font-medium text-slate-navy"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id} ({w.name.split(' ')[0]})
                </option>
              ))}
            </select>

            <button
              onClick={handleTriggerCalamityClick}
              className="text-xs font-bold px-3 py-1.5 rounded-btn bg-risk-high text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs"
              title="Simulate severe environmental failure"
            >
              🔥 Trigger Calamity
            </button>
          </div>

          {onNavigateToForm && (
            <Button variant="primary" onClick={onNavigateToForm} className="text-xs py-2">
              + New Batch Assessment
            </Button>
          )}
        </div>
      </div>

      {/* SVG Risk Radar Network Map */}
      <RiskRadar warehouses={warehouses} stocks={stocks} />

      {/* View Switcher Tabs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-light pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('stocks')}
            className={`px-4 py-2 text-xs font-bold rounded-btn transition-colors ${
              activeView === 'stocks'
                ? 'bg-slate-navy text-white shadow-xs'
                : 'bg-surface text-slate-600 hover:text-slate-navy border border-slate-light'
            }`}
          >
            Cold Storage Inventory ({stocks.length})
          </button>
          <button
            onClick={() => setActiveView('transit')}
            className={`px-4 py-2 text-xs font-bold rounded-btn transition-colors ${
              activeView === 'transit'
                ? 'bg-slate-navy text-white shadow-xs'
                : 'bg-surface text-slate-600 hover:text-slate-navy border border-slate-light'
            }`}
          >
            Active Transit Batches ({shipments.length})
          </button>
        </div>

        <p className="text-xs text-text-muted">
          Showing {activeView === 'stocks' ? 'warehouse storage inventory stock' : 'active transit shipments'}
        </p>
      </div>

      {/* Card Grid View */}
      {activeView === 'stocks' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => {
            const wh = warehouses.find((w) => w.id === stock.warehouse_id);

            return (
              <ShipmentCard
                key={stock.id}
                id={stock.id}
                stockId={stock.id}
                produceType={stock.produce_type}
                riskLevel={stock.risk_level}
                riskScore={stock.risk_score}
                temperature={stock.temperature_c || wh?.current_temp || 18.0}
                humidity={stock.humidity_pct || wh?.current_humidity || 70}
                transitTime={stock.candidateTransitHours || 6.0}
                distance={stock.candidateDistanceKm || 120}
                recommendedAction={stock.recommended_action || 'Optimal storage parameters maintained.'}
                candidateWarehouseName={stock.candidateWarehouseName}
                candidateDistanceKm={stock.candidateDistanceKm}
                candidateTransitHours={stock.candidateTransitHours}
                rescueEligible={stock.rescueEligible}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              id={shipment.id}
              produceType={shipment.produceType}
              riskLevel={shipment.riskLevel}
              riskScore={shipment.riskScore || 20.0}
              temperature={shipment.temperature}
              humidity={shipment.humidity}
              transitTime={shipment.transitTime}
              distance={shipment.distance}
              recommendedAction={shipment.recommendedAction}
              candidateWarehouseName={shipment.candidateWarehouseName}
              candidateDistanceKm={shipment.candidateDistanceKm}
              candidateTransitHours={shipment.candidateTransitHours}
              rescueEligible={shipment.rescueEligible}
              onClick={() => onSelectShipment && onSelectShipment(shipment)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
