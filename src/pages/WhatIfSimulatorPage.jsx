import React, { useState, useEffect, useRef, useCallback } from 'react';
import WhatIfSlider from '../components/WhatIfSlider';
import RiskBadge from '../components/RiskBadge';
import StatField from '../components/StatField';
import Button from '../components/Button';
import { getPrediction } from '../services/predictService';

const PRODUCE_OPTIONS = [
  'Jasmine Flowers',
  'Red Roses',
  'Marigold Flowers',
  'Orange',
  'Pineapple',
  'Banana',
  'Tomatoes',
  'Fresh Spinach',
];

const BASELINE_DEFAULTS = {
  produce_type: 'Jasmine Flowers',
  temperature_c: 18.0,
  humidity_pct: 70,
  light_flux: 400,
  co2_ppm: 450,
  transit_time_hours: 6.0,
  distance_km: 120,
};

/**
 * WhatIfSimulatorPage component per updated COMPONENTS.md:
 * - 6 sliders total: temperature, humidity, light flux, CO2 ppm, transit time, distance
 * - Placeholder ranges for light_flux (0-2000) and co2_ppm (300-2000) pending teammate dataset ranges
 * - Two-column current-vs-proposed layout
 * - Debounces changes (300-500ms) and calls getPrediction() from predictService.js
 */
export default function WhatIfSimulatorPage() {
  const [produceType, setProduceType] = useState(BASELINE_DEFAULTS.produce_type);

  // Baseline state (Column 1)
  const [baselineMetrics] = useState({
    temperature_c: 18.0,
    humidity_pct: 70,
    light_flux: 400,
    co2_ppm: 450,
    transit_time_hours: 6.0,
    distance_km: 120,
  });
  const [baselinePrediction, setBaselinePrediction] = useState(null);
  const [isBaselineLoading, setIsBaselineLoading] = useState(false);

  // Proposed scenario sliders state (Column 2 - 6 sliders total)
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    temperature_c: 24.0,
    humidity_pct: 82,
    light_flux: 900,
    co2_ppm: 1100,
    transit_time_hours: 10.0,
    distance_km: 180,
  });
  const [simulatedPrediction, setSimulatedPrediction] = useState(null);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimerRef = useRef(null);

  // Fetch baseline prediction on mount or produce type change
  useEffect(() => {
    let isMounted = true;
    setIsBaselineLoading(true);

    getPrediction({
      produce_type: produceType,
      ...baselineMetrics,
    })
      .then((res) => {
        if (isMounted) {
          setBaselinePrediction(res);
          setIsBaselineLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsBaselineLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [produceType, baselineMetrics]);

  // Debounced prediction fetch for simulated scenario
  const fetchSimulatedPrediction = useCallback((metrics, type) => {
    setIsSimulatedLoading(true);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      getPrediction({
        produce_type: type,
        ...metrics,
      })
        .then((res) => {
          setSimulatedPrediction(res);
          setIsSimulatedLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Simulation prediction failed');
          setIsSimulatedLoading(false);
        });
    }, 400); // 400ms debounce per COMPONENTS.md spec
  }, []);

  // Trigger debounced prediction whenever simulated metrics or produce type changes
  useEffect(() => {
    fetchSimulatedPrediction(simulatedMetrics, produceType);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [simulatedMetrics, produceType, fetchSimulatedPrediction]);

  const handleSliderChange = (key, val) => {
    setSimulatedMetrics((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleResetToBaseline = () => {
    setSimulatedMetrics({ ...baselineMetrics });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-surface p-5 rounded-card border border-slate-light flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-navy">What-If Spoilage Simulator</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Adjust environmental and transport sliders to simulate live risk shifts in real time (6 parameters).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sim-produce-select" className="text-xs font-semibold text-slate-navy whitespace-nowrap">
            Target Commodity:
          </label>
          <select
            id="sim-produce-select"
            value={produceType}
            onChange={(e) => setProduceType(e.target.value)}
            className="h-9 px-3 rounded-btn border border-slate-light bg-background text-xs font-semibold text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy"
          >
            {PRODUCE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-btn bg-red-50 border border-risk-high/30 text-risk-high text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-risk-high hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Two-Column Layout: Baseline vs Proposed Scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Current Baseline */}
        <div className="bg-surface p-6 rounded-card border border-slate-light shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-light pb-3">
              <div>
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Baseline Scenario
                </span>
                <h3 className="text-base font-bold text-slate-navy">Current Transport Conditions</h3>
              </div>
              {isBaselineLoading ? (
                <span className="text-xs text-text-muted animate-pulse">Loading baseline...</span>
              ) : (
                baselinePrediction && <RiskBadge level={baselinePrediction.risk_level} />
              )}
            </div>

            {/* Baseline Stat Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-background p-4 rounded-btn border border-slate-light">
              <StatField label="Temperature" value={`${baselineMetrics.temperature_c}°C`} />
              <StatField label="Humidity" value={`${baselineMetrics.humidity_pct}%`} />
              <StatField label="Light Flux" value={`${baselineMetrics.light_flux}`} />
              <StatField label="CO2 Level" value={`${baselineMetrics.co2_ppm} ppm`} />
              <StatField label="Transit Time" value={`${baselineMetrics.transit_time_hours} hrs`} />
              <StatField label="Distance" value={`${baselineMetrics.distance_km} km`} />
            </div>

            {/* Baseline Prediction Summary */}
            {baselinePrediction && (
              <div className="bg-slate-50 p-4 rounded-btn border border-slate-light space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Baseline Recommended Action
                  </span>
                  {baselinePrediction.risk_score !== undefined && (
                    <span className="text-xs font-bold text-slate-navy">
                      Score: {baselinePrediction.risk_score}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-navy">
                  {baselinePrediction.recommended_action}
                </p>
                {baselinePrediction.explanation && (
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">
                    {baselinePrediction.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-text-muted italic border-t border-slate-light pt-3">
            Reference standard conditions for {produceType}.
          </div>
        </div>

        {/* Column 2: Simulated Scenario & 6 Sliders */}
        <div className="bg-surface p-6 rounded-card border-2 border-slate-navy/20 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-light pb-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Simulated Scenario
              </span>
              <h3 className="text-base font-bold text-slate-navy">6 Parameter Sliders</h3>
            </div>

            <div className="flex items-center gap-2">
              {isSimulatedLoading && (
                <span className="text-xs font-medium text-slate-navy animate-pulse flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-btn">
                  <svg className="animate-spin h-3.5 w-3.5 text-slate-navy" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Updating...
                </span>
              )}
              {simulatedPrediction && (
                <RiskBadge level={simulatedPrediction.risk_level} className="transition-all duration-300 transform scale-105" />
              )}
            </div>
          </div>

          {/* 6 Interactive Sliders Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WhatIfSlider
              label="Temperature"
              value={simulatedMetrics.temperature_c}
              min={5}
              max={45}
              step={0.5}
              unit="°C"
              onChange={(val) => handleSliderChange('temperature_c', val)}
            />

            <WhatIfSlider
              label="Humidity"
              value={simulatedMetrics.humidity_pct}
              min={30}
              max={98}
              step={1}
              unit="%"
              onChange={(val) => handleSliderChange('humidity_pct', val)}
            />

            {/* TODO: Confirm real dataset light_flux range with teammate */}
            <WhatIfSlider
              label="Light Flux"
              value={simulatedMetrics.light_flux}
              min={0}
              max={2000}
              step={10}
              unit="flux"
              onChange={(val) => handleSliderChange('light_flux', val)}
            />

            {/* TODO: Confirm real dataset co2_ppm range with teammate */}
            <WhatIfSlider
              label="CO2 Level"
              value={simulatedMetrics.co2_ppm}
              min={300}
              max={2000}
              step={10}
              unit="ppm"
              onChange={(val) => handleSliderChange('co2_ppm', val)}
            />

            <WhatIfSlider
              label="Transit Time"
              value={simulatedMetrics.transit_time_hours}
              min={1}
              max={36}
              step={0.5}
              unit="hrs"
              onChange={(val) => handleSliderChange('transit_time_hours', val)}
            />

            <WhatIfSlider
              label="Distance"
              value={simulatedMetrics.distance_km}
              min={10}
              max={800}
              step={10}
              unit="km"
              onChange={(val) => handleSliderChange('distance_km', val)}
            />
          </div>

          {/* Live Updating Simulation Result Card */}
          {simulatedPrediction && (
            <div className="bg-slate-50 p-4 rounded-btn border border-slate-light space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Live Simulated Action
                </span>
                {simulatedPrediction.risk_score !== undefined && (
                  <span className="text-xs font-bold text-slate-navy bg-slate-200 px-2 py-0.5 rounded-btn">
                    Risk Score: {simulatedPrediction.risk_score} / 100
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-slate-navy leading-snug">
                {simulatedPrediction.recommended_action}
              </p>
              {simulatedPrediction.explanation && (
                <p className="text-xs text-text-muted leading-relaxed">
                  {simulatedPrediction.explanation}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button variant="secondary" onClick={handleResetToBaseline} className="text-xs py-1.5">
              Reset to Baseline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
