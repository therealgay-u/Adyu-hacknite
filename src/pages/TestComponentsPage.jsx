import React from 'react';
import RiskBadge from '../components/RiskBadge';
import Button from '../components/Button';
import StatField from '../components/StatField';
import ShipmentCard from '../components/ShipmentCard';

/**
 * Component Showcase page for quick visual testing of reusable UI components.
 */
export default function TestComponentsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="border-b border-slate-light pb-4">
        <h2 className="text-lg font-bold text-slate-navy">Component System Showcase</h2>
        <p className="text-xs text-text-muted mt-1">
          Visual test harness for verifying components against design.md & COMPONENTS.md guidelines.
        </p>
      </div>

      {/* 1. Risk Badges */}
      <section className="bg-surface p-6 rounded-card border border-slate-light space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-navy">1. Risk Badges (&lt;RiskBadge level /&gt;)</h3>
          <p className="text-xs text-text-muted">Pill-shaped, filled background in risk color, bold uppercase text.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">Low Risk (#16A34A)</span>
            <RiskBadge level="Low" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">Medium Risk (#D97706)</span>
            <RiskBadge level="Medium" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">High Risk (#DC2626)</span>
            <RiskBadge level="High" />
          </div>
        </div>
      </section>

      {/* 2. Buttons */}
      <section className="bg-surface p-6 rounded-card border border-slate-light space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-navy">2. Buttons (&lt;Button variant /&gt;)</h3>
          <p className="text-xs text-text-muted">Primary (Slate Navy fill) and Secondary (White fill with slate border).</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">Primary Variant</span>
            <Button variant="primary">Dispatch Shipment</Button>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">Secondary Variant</span>
            <Button variant="secondary">View Details</Button>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] text-text-muted font-medium">Disabled State</span>
            <Button variant="primary" disabled>
              Processing...
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Stat Fields */}
      <section className="bg-surface p-6 rounded-card border border-slate-light space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-navy">3. Stat Fields (&lt;StatField label value /&gt;)</h3>
          <p className="text-xs text-text-muted">Small reusable metric row: 12px muted label + 14px dark slate value.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-background rounded-btn border border-slate-light">
          <StatField label="Temperature" value="24.5°C" />
          <StatField label="Humidity" value="82%" />
          <StatField label="Transit Time" value="6.5 hrs" />
          <StatField label="Distance" value="180 km" />
        </div>
      </section>

      {/* 4. Shipment Cards */}
      <section className="bg-surface p-6 rounded-card border border-slate-light space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-navy">4. Shipment Cards (&lt;ShipmentCard /&gt;)</h3>
          <p className="text-xs text-text-muted">Composes RiskBadge + StatField for Vegetables & Flowers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <ShipmentCard
            id="BATCH-101"
            produceType="Jasmine Flowers"
            riskLevel="High"
            temperature={28.2}
            humidity={88}
            transitTime={14}
            distance={240}
            recommendedAction="Redirect immediately to nearest cold-storage hub in Mysuru"
          />
          <ShipmentCard
            id="BATCH-102"
            produceType="Red Roses"
            riskLevel="Medium"
            temperature={19.5}
            humidity={75}
            transitTime={7.5}
            distance={110}
            recommendedAction="Prioritize express route dispatch to local wholesale market"
          />
          <ShipmentCard
            id="BATCH-103"
            produceType="Tomatoes (Grade A)"
            riskLevel="Low"
            temperature={14.0}
            humidity={65}
            transitTime={4.0}
            distance={65}
            recommendedAction="Standard route dispatch on schedule"
          />
        </div>
      </section>
    </div>
  );
}
