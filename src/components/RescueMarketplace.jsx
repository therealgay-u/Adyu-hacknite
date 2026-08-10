import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import Button from './Button';

/**
 * RescueMarketplace component per requirements:
 * - Rendered whenever a stock item's rescueEligible flag is true.
 * - Displays 2-3 realistic nearby buyer names + distances based on produce/flower type.
 * - "Notify Buyer" button triggers an interactive confirmation animation ("✔ Notified!") and toast.
 *
 * @param {Object} props
 * @param {string} [props.stockId] - Stock ID to look up from context
 * @param {Object} [props.stock] - Direct stock object
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export default function RescueMarketplace({ stockId, stock: customStock, className = '' }) {
  const context = useWarehouse();
  const stock = customStock || (stockId ? context.stocks.find((s) => s.id === stockId) : null);

  const [notifiedState, setNotifiedState] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Render ONLY if stock item is flagged for rescue eligibility
  const isRescueEligible =
    stock?.rescueEligible ||
    (stock?.recommended_action && stock.recommended_action.toLowerCase().includes('rescue'));

  if (!stock || !isRescueEligible) {
    return null;
  }

  const produceName = stock.produce_type || 'Perishable Cargo';
  const isFlower = /rose|jasmine|marigold|flower/i.test(produceName);

  // Realistic buyers list tailored to commodity type
  const buyers = isFlower
    ? [
        {
          id: 'buyer-flw-1',
          name: 'Local Flower Market (Koyambedu)',
          distance: '5 km',
          offeredRate: '₹180 / kg',
          estimatedPickup: 'Within 45 mins',
        },
        {
          id: 'buyer-flw-2',
          name: 'Sri Lakshmi Garland Suppliers',
          distance: '8 km',
          offeredRate: '₹165 / kg',
          estimatedPickup: 'Within 1.5 hrs',
        },
        {
          id: 'buyer-flw-3',
          name: 'Heritage Wedding Decorators',
          distance: '12 km',
          offeredRate: '₹150 / kg',
          estimatedPickup: 'Within 2.0 hrs',
        },
      ]
    : [
        {
          id: 'buyer-veg-1',
          name: 'Kisan Direct Rescue Outlet',
          distance: '4 km',
          offeredRate: '₹38 / kg',
          estimatedPickup: 'Within 30 mins',
        },
        {
          id: 'buyer-veg-2',
          name: 'City Juice & Pulp Processing Co.',
          distance: '8 km',
          offeredRate: '₹42 / kg',
          estimatedPickup: 'Within 1.0 hr',
        },
        {
          id: 'buyer-veg-3',
          name: 'Sharma Restaurant & Catering Network',
          distance: '12 km',
          offeredRate: '₹45 / kg',
          estimatedPickup: 'Within 1.5 hrs',
        },
      ];

  const handleNotifyBuyer = (buyer) => {
    setNotifiedState((prev) => ({ ...prev, [buyer.id]: true }));
    setToastMessage(`Dispatch offer broadcasted to ${buyer.name}!`);

    setTimeout(() => {
      setToastMessage((current) =>
        current?.includes(buyer.name) ? null : current
      );
    }, 3500);
  };

  return (
    <div
      className={`bg-surface rounded-card border border-amber-300/70 p-4 shadow-sm space-y-3 relative ${className}`}
    >
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-btn shadow-md flex items-center gap-1.5 animate-fadeIn z-10">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-light pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h4 className="text-sm font-bold text-slate-navy">Rescue Marketplace — Express Buyer Matching</h4>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Severe spoilage risk detected for <strong className="text-slate-navy">{produceName}</strong>. Match with immediate local buyers to prevent full loss.
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-btn bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
          Rescue Active
        </span>
      </div>

      {/* Buyers List */}
      <div className="space-y-2">
        {buyers.map((buyer) => {
          const isNotified = Boolean(notifiedState[buyer.id]);

          return (
            <div
              key={buyer.id}
              className={`flex items-center justify-between p-3 rounded-btn border transition-colors ${
                isNotified
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-background border-slate-light hover:border-slate-muted'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-navy">{buyer.name}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded-btn">
                    {buyer.distance}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Offer: <strong className="text-slate-navy">{buyer.offeredRate}</strong> • Pickup: {buyer.estimatedPickup}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleNotifyBuyer(buyer)}
                disabled={isNotified}
                className={`text-xs font-semibold px-3 py-1.5 rounded-btn transition-all ${
                  isNotified
                    ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                    : 'bg-slate-navy text-white hover:bg-slate-deep active:scale-95 shadow-xs'
                }`}
              >
                {isNotified ? '✔ Notified!' : 'Notify Buyer'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
