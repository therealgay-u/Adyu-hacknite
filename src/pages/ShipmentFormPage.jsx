import React, { useState } from 'react';
import ShipmentForm from '../components/ShipmentForm';
import { getPrediction } from '../services/predictService';

/**
 * ShipmentFormPage component:
 * Houses <ShipmentForm />, invokes getPrediction() on submit, handles loading/error,
 * and passes the result payload to onPredictionComplete callback.
 *
 * @param {Object} props
 * @param {function(Object, Object): void} props.onPredictionComplete - Callback receiving (result, payload)
 */
export default function ShipmentFormPage({ onPredictionComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPrediction(payload);
      setIsLoading(false);
      if (onPredictionComplete) {
        onPredictionComplete(result, payload);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to generate prediction. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-btn bg-red-50 border border-risk-high/30 text-risk-high text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-risk-high hover:underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      <ShipmentForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
