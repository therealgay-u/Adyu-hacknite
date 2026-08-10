import React from 'react';
import PredictionResult from '../components/PredictionResult';
import Button from '../components/Button';

/**
 * PredictionResultPage component per requirements:
 * Displays prediction output using <PredictionResult /> and handles loading / error states.
 *
 * @param {Object} props
 * @param {boolean} [props.isLoading=false]
 * @param {string} [props.error]
 * @param {Object} [props.predictionResult] - Result object { risk_level, risk_score, recommended_action, explanation }
 * @param {Object} [props.payload] - Original input payload { produce_type, temperature_c, humidity_pct, transit_time_hours, distance_km }
 * @param {function(): void} [props.onReset] - Callback to return to form
 * @param {function(): void} [props.onGoToDashboard] - Callback to return to dashboard
 */
export default function PredictionResultPage({
  isLoading = false,
  error = null,
  predictionResult,
  payload,
  onReset,
  onGoToDashboard,
}) {
  // 1. Loading state view
  if (isLoading) {
    return (
      <div className="bg-surface rounded-card border border-slate-light p-12 max-w-xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-navy">
          <svg className="animate-spin h-6 w-6 text-slate-navy" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-navy">Analyzing Spoilage Models...</h3>
        <p className="text-xs text-text-muted">
          Evaluating ambient thermal exposure, transit duration, and biological decay rates.
        </p>
      </div>
    );
  }

  // 2. Error state view
  if (error) {
    return (
      <div className="bg-surface rounded-card border border-risk-high/30 p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-risk-high">
          ⚠️
        </div>
        <h3 className="text-base font-bold text-slate-navy">Prediction Request Failed</h3>
        <p className="text-xs text-risk-high font-medium">{error}</p>
        <div className="pt-2 flex justify-center gap-3">
          {onReset && (
            <Button variant="secondary" onClick={onReset}>
              Try Again
            </Button>
          )}
          {onGoToDashboard && (
            <Button variant="primary" onClick={onGoToDashboard}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 3. Fallback if no prediction result is present
  if (!predictionResult) {
    return (
      <div className="bg-surface rounded-card border border-slate-light p-8 max-w-xl mx-auto text-center space-y-4">
        <h3 className="text-base font-bold text-slate-navy">No Active Assessment Selected</h3>
        <p className="text-xs text-text-muted">
          Select a shipment batch from the dashboard or submit a new form to view prediction results.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {onReset && (
            <Button variant="primary" onClick={onReset}>
              New Assessment Form
            </Button>
          )}
          {onGoToDashboard && (
            <Button variant="secondary" onClick={onGoToDashboard}>
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 4. Clean prediction result view
  return (
    <PredictionResult
      riskLevel={predictionResult.risk_level}
      riskScore={predictionResult.risk_score}
      recommendedAction={predictionResult.recommended_action}
      explanation={predictionResult.explanation}
      payload={payload}
      onReset={onReset}
      onGoToDashboard={onGoToDashboard}
    />
  );
}
