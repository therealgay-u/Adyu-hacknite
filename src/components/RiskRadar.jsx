import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import RiskBadge from './RiskBadge';

// Fixed approximate layout grid positions for standard network nodes
const PRESET_COORDINATES = {
  'WH-BLR-01': { x: 300, y: 170, shortName: 'Bengaluru Hub' },
  'WH-HOS-05': { x: 430, y: 190, shortName: 'Hosur Center' },
  'WH-MYS-02': { x: 190, y: 240, shortName: 'Mysuru Cold Storage' },
  'WH-CHE-03': { x: 570, y: 140, shortName: 'Chennai Terminal' },
  'WH-COI-04': { x: 160, y: 300, shortName: 'Coimbatore Hub' },
  'WH-HYD-06': { x: 410, y: 65, shortName: 'Hyderabad Terminal' },
};

/**
 * RiskRadar SVG network view component per requirements:
 * - Each warehouse rendered as a node dot at fixed layout position
 * - Dot color = worst stock risk_level at that warehouse (green/amber/red)
 * - Pulsing/glow animation on any warehouse currently at High risk
 * - Animated vector line drawn from origin -> candidate warehouse when routing active
 *
 * @param {Object} props
 * @param {Array<Object>} [props.warehouses] - List of warehouse objects
 * @param {Array<Object>} [props.stocks] - List of stock items
 */
export default function RiskRadar({ warehouses: customWarehouses, stocks: customStocks }) {
  const context = useWarehouse();
  const warehouses = customWarehouses || context.warehouses || [];
  const stocks = customStocks || context.stocks || [];

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Compute node coordinates dynamically for any new/custom nodes
  const getNodePosition = (wh, index, total) => {
    if (PRESET_COORDINATES[wh.id]) {
      return PRESET_COORDINATES[wh.id];
    }
    // Fallback circle positioning around canvas center (350, 180)
    const angle = (index / Math.max(1, total)) * 2 * Math.PI;
    const rx = 200;
    const ry = 110;
    return {
      x: Math.round(350 + rx * Math.cos(angle)),
      y: Math.round(180 + ry * Math.sin(angle)),
      shortName: wh.name || wh.id,
    };
  };

  // Determine worst stock risk level at each warehouse
  const getWarehouseRiskLevel = (whId, status) => {
    const whStocks = stocks.filter((s) => s.warehouse_id === whId);
    if (whStocks.length > 0) {
      if (whStocks.some((s) => (s.risk_level || '').toLowerCase() === 'high')) return 'High';
      if (whStocks.some((s) => (s.risk_level || '').toLowerCase() === 'medium')) return 'Medium';
      return 'Low';
    }
    // Fallback to warehouse status if no stock items assigned
    if (status === 'Critical') return 'High';
    if (status === 'Warning') return 'Medium';
    return 'Low';
  };

  const getRiskColor = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'high':
        return '#DC2626'; // Red
      case 'medium':
        return '#D97706'; // Amber
      case 'low':
      default:
        return '#16A34A'; // Green
    }
  };

  // Build warehouse node objects with coordinates and risk state
  const nodes = warehouses.map((wh, idx) => {
    const pos = getNodePosition(wh, idx, warehouses.length);
    const riskLevel = getWarehouseRiskLevel(wh.id, wh.status);
    const color = getRiskColor(riskLevel);
    const isHighRisk = riskLevel === 'High';
    const whStocks = stocks.filter((s) => s.warehouse_id === wh.id);

    return {
      ...wh,
      x: pos.x,
      y: pos.y,
      shortName: pos.shortName,
      riskLevel,
      color,
      isHighRisk,
      stockCount: whStocks.length,
    };
  });

  // Extract unique active candidate routing lines (origin warehouse -> target candidate warehouse)
  const routingLines = [];
  stocks.forEach((stk) => {
    if (stk.candidateWarehouseId && stk.warehouse_id) {
      const fromNode = nodes.find((n) => n.id === stk.warehouse_id);
      const toNode = nodes.find((n) => n.id === stk.candidateWarehouseId);
      if (fromNode && toNode && fromNode.id !== toNode.id) {
        // Prevent exact duplicate lines
        const exists = routingLines.some(
          (l) => l.fromId === fromNode.id && l.toId === toNode.id && l.produceType === stk.produce_type
        );
        if (!exists) {
          routingLines.push({
            id: `${stk.id}-${fromNode.id}-${toNode.id}`,
            fromId: fromNode.id,
            toId: toNode.id,
            fromName: fromNode.shortName,
            toName: toNode.shortName,
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            produceType: stk.produce_type,
            distanceKm: stk.candidateDistanceKm || 0,
            transitHours: stk.candidateTransitHours || 0,
            riskLevel: stk.risk_level || 'High',
          });
        }
      }
    }
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="bg-slate-navy rounded-card border border-slate-muted/40 p-5 text-white shadow-md space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-muted/30 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white tracking-wide">Risk Radar — Network Vector Map</h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time cold-chain topology. Line vectors display active rerouting paths to nearest safe candidate nodes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-deep/80 px-3 py-1.5 rounded-btn border border-white/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block"></span>
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block"></span>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping inline-block"></span>
            <span className="text-red-300 font-bold">Critical</span>
          </div>
        </div>
      </div>

      {/* SVG Radar Canvas */}
      <div className="relative w-full overflow-hidden rounded-btn bg-slate-900/90 border border-slate-muted/30">
        <svg viewBox="0 0 700 360" className="w-full h-auto max-h-[360px] select-none">
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
            </pattern>

            {/* Glowing filter for high risk nodes */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Marker arrowhead for routing lines */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#DC2626" />
            </marker>
          </defs>

          {/* Grid Layer */}
          <rect width="700" height="360" fill="url(#radarGrid)" />

          {/* Concentric Radar Rings */}
          <circle cx="350" cy="180" r="140" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="350" cy="180" r="80" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

          {/* Active Routing Line Vectors */}
          {routingLines.map((line) => {
            const midX = (line.fromX + line.toX) / 2;
            const midY = (line.fromY + line.toY) / 2;

            return (
              <g key={line.id}>
                {/* Outer Glow Line */}
                <line
                  x1={line.fromX}
                  y1={line.fromY}
                  x2={line.toX}
                  y2={line.toY}
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeOpacity="0.4"
                />

                {/* Animated Dashed Vector Line */}
                <line
                  x1={line.fromX}
                  y1={line.fromY}
                  x2={line.toX}
                  y2={line.toY}
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  markerEnd="url(#arrow)"
                >
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                </line>

                {/* Route Distance Badge */}
                <g transform={`translate(${midX}, ${midY - 8})`}>
                  <rect
                    x="-45"
                    y="-10"
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0F172A"
                    stroke="#EF4444"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#FCA5A5"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    REROUTE {line.distanceKm}km
                  </text>
                </g>
              </g>
            );
          })}

          {/* Warehouse Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                className="cursor-pointer group"
              >
                {/* High Risk Pulsing Aura */}
                {node.isHighRisk && (
                  <circle r="22" fill="#DC2626" opacity="0.35">
                    <animate attributeName="r" values="14;28;14" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.05;0.5" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Selection Halo */}
                {isSelected && (
                  <circle r="20" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3,3" />
                )}

                {/* Main Node Circle */}
                <circle
                  r="12"
                  fill={node.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter={node.isHighRisk ? 'url(#glow)' : undefined}
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Internal Node Pulse Center */}
                <circle r="4" fill="#FFFFFF" />

                {/* Node Label Text */}
                <text
                  y="24"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="11"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow-md"
                >
                  {node.shortName}
                </text>

                {/* Stock Count Pill */}
                <text
                  y="-18"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {node.stockCount} batches
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="bg-slate-deep/90 border border-slate-muted/50 p-4 rounded-btn flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{selectedNode.name}</span>
              <span className="text-slate-400">({selectedNode.id})</span>
              <RiskBadge level={selectedNode.riskLevel} className="text-[10px] px-2 py-0.5" />
            </div>
            <p className="text-slate-300 mt-1">
              Current Conditions: <strong className="text-white">{selectedNode.current_temp}°C</strong> •{' '}
              <strong className="text-white">{selectedNode.current_humidity}% Humidity</strong> • Capacity:{' '}
              <strong className="text-white">{selectedNode.capacity} crates</strong>
            </p>
          </div>

          <button
            onClick={() => setSelectedNodeId(null)}
            className="text-slate-400 hover:text-white font-bold px-2 py-1 rounded-btn hover:bg-white/10 self-start sm:self-auto"
          >
            Close ✕
          </button>
        </div>
      )}
    </div>
  );
}
