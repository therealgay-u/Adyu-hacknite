import React, { useState } from 'react';
import Button from './Button';

const PRODUCE_OPTIONS = [
  { group: 'Flowers (Differentiator)', items: ['Jasmine Flowers', 'Red Roses', 'Marigold Flowers'] },
  { group: 'Fruits & Produce', items: ['Orange', 'Pineapple', 'Banana'] },
  { group: 'Vegetables & Greens', items: ['Tomatoes', 'Fresh Spinach', 'Capsicum', 'Onions'] },
];

/**
 * ShipmentForm component per updated COMPONENTS.md:
 * Single column, 7 labeled fields:
 * produce_type, temperature_c, humidity_pct, light_flux, co2_ppm, transit_time_hours, distance_km.
 * Generous input height, clear focus states in slate navy. Submit button primary variant.
 *
 * @param {Object} props
 * @param {function(Object): void} props.onSubmit - Callback receiving payload object
 * @param {boolean} [props.isLoading=false] - Loading state for submit button
 */
export default function ShipmentForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    produce_type: 'Jasmine Flowers',
    temperature_c: '26.5',
    humidity_pct: '80',
    light_flux: '500',
    co2_ppm: '450',
    transit_time_hours: '10',
    distance_km: '180',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        produce_type: formData.produce_type,
        temperature_c: parseFloat(formData.temperature_c) || 0,
        humidity_pct: parseFloat(formData.humidity_pct) || 0,
        light_flux: parseFloat(formData.light_flux) || 0,
        co2_ppm: parseFloat(formData.co2_ppm) || 0,
        transit_time_hours: parseFloat(formData.transit_time_hours) || 0,
        distance_km: parseFloat(formData.distance_km) || 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto bg-surface p-6 sm:p-8 rounded-card border border-slate-light shadow-sm">
      <div className="border-b border-slate-light pb-4">
        <h2 className="text-lg font-bold text-slate-navy">New Shipment Risk Assessment</h2>
        <p className="text-xs text-text-muted mt-1">
          Enter environmental sensors (temp, humidity, light, CO2) and transit metrics to predict spoilage risk and smart dispatch recommendations.
        </p>
      </div>

      {/* 1. Produce Type Select */}
      <div className="space-y-1.5">
        <label htmlFor="produce_type" className="block text-xs font-semibold text-slate-navy">
          Produce / Flower Type <span className="text-risk-high">*</span>
        </label>
        <select
          id="produce_type"
          name="produce_type"
          value={formData.produce_type}
          onChange={handleChange}
          required
          className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
        >
          {PRODUCE_OPTIONS.map((optGroup) => (
            <optgroup key={optGroup.group} label={optGroup.group}>
              {optGroup.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Grid for environmental sensors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 2. Temperature Input */}
        <div className="space-y-1.5">
          <label htmlFor="temperature_c" className="block text-xs font-semibold text-slate-navy">
            Ambient Temp (°C) <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="temperature_c"
            name="temperature_c"
            step="0.1"
            min="-10"
            max="60"
            value={formData.temperature_c}
            onChange={handleChange}
            required
            placeholder="e.g. 26.5"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>

        {/* 3. Humidity Input */}
        <div className="space-y-1.5">
          <label htmlFor="humidity_pct" className="block text-xs font-semibold text-slate-navy">
            Relative Humidity (%) <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="humidity_pct"
            name="humidity_pct"
            step="1"
            min="0"
            max="100"
            value={formData.humidity_pct}
            onChange={handleChange}
            required
            placeholder="e.g. 80"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>

        {/* 4. Light Flux Input */}
        <div className="space-y-1.5">
          <label htmlFor="light_flux" className="block text-xs font-semibold text-slate-navy">
            Light Flux <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="light_flux"
            name="light_flux"
            step="10"
            min="0"
            max="5000"
            value={formData.light_flux}
            onChange={handleChange}
            required
            placeholder="e.g. 500"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>

        {/* 5. CO2 ppm Input */}
        <div className="space-y-1.5">
          <label htmlFor="co2_ppm" className="block text-xs font-semibold text-slate-navy">
            CO2 Level (PPM) <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="co2_ppm"
            name="co2_ppm"
            step="10"
            min="0"
            max="5000"
            value={formData.co2_ppm}
            onChange={handleChange}
            required
            placeholder="e.g. 450"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>
      </div>

      {/* Grid for transit metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 6. Transit Time Input */}
        <div className="space-y-1.5">
          <label htmlFor="transit_time_hours" className="block text-xs font-semibold text-slate-navy">
            Transit Time (Hours) <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="transit_time_hours"
            name="transit_time_hours"
            step="0.5"
            min="0.5"
            max="120"
            value={formData.transit_time_hours}
            onChange={handleChange}
            required
            placeholder="e.g. 10.0"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>

        {/* 7. Distance Input */}
        <div className="space-y-1.5">
          <label htmlFor="distance_km" className="block text-xs font-semibold text-slate-navy">
            Distance (KM) <span className="text-risk-high">*</span>
          </label>
          <input
            type="number"
            id="distance_km"
            name="distance_km"
            step="1"
            min="1"
            max="5000"
            value={formData.distance_km}
            onChange={handleChange}
            required
            placeholder="e.g. 180"
            className="w-full h-11 px-3.5 rounded-btn border border-slate-light bg-surface text-sm text-slate-navy focus:outline-none focus:ring-2 focus:ring-slate-navy focus:border-slate-navy transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button variant="primary" type="submit" disabled={isLoading} className="w-full h-11 text-base">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Evaluating Spoilage Model...
            </span>
          ) : (
            'Calculate Risk & Recommendation'
          )}
        </Button>
      </div>
    </form>
  );
}
