/**
 * Single source of truth for spoilage risk predictions and mock shipment data.
 * Gated by USE_MOCK constant. Flipping USE_MOCK to false switches the entire
 * application from mock data to live backend fetch API without any other code changes.
 */
export const USE_MOCK = False;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Initial mock shipments dataset for Dashboard.
 * Includes all 7 dataset attributes: produce_type, temperature_c, humidity_pct,
 * light_flux, co2_ppm, transit_time_hours, distance_km.
 */
export const INITIAL_MOCK_SHIPMENTS = [
  {
    id: 'BATCH-2026-001',
    produceType: 'Jasmine Flowers',
    temperature: 28.5,
    humidity: 86,
    lightFlux: 1200,
    co2Ppm: 1100,
    transitTime: 14,
    distance: 260,
    riskLevel: 'High',
    riskScore: 88.5,
    recommendedAction: 'Redirect immediately to Mysuru Cold Storage Hub',
    explanation: 'High ambient temperature (28.5°C), elevated light exposure (1200 flux), and high CO2 levels (1100 ppm) accelerate flower respiration and petal degradation during 14 hrs transit.'
  },
  {
    id: 'BATCH-2026-002',
    produceType: 'Marigold Flowers',
    temperature: 22.0,
    humidity: 78,
    lightFlux: 650,
    co2Ppm: 750,
    transitTime: 8.5,
    distance: 140,
    riskLevel: 'Medium',
    riskScore: 58.2,
    recommendedAction: 'Prioritize express route dispatch to Koyambedu Market',
    explanation: 'Moderate temperature and light elevation pose noticeable risk of petal disfigurement if transit exceeds 8 hours.'
  },
  {
    id: 'BATCH-2026-003',
    produceType: 'Red Roses',
    temperature: 15.2,
    humidity: 70,
    lightFlux: 300,
    co2Ppm: 450,
    transitTime: 5.0,
    distance: 85,
    riskLevel: 'Low',
    riskScore: 18.4,
    recommendedAction: 'Standard route dispatch on schedule',
    explanation: 'Optimal cold-chain temperature and controlled light/CO2 levels maintained; zero thermal stress detected.'
  },
  {
    id: 'BATCH-2026-004',
    produceType: 'Tomatoes',
    temperature: 26.0,
    humidity: 82,
    lightFlux: 950,
    co2Ppm: 1300,
    transitTime: 11.0,
    distance: 195,
    riskLevel: 'High',
    riskScore: 84.0,
    recommendedAction: 'Rescue channel: sell to local processing unit immediately',
    explanation: 'Leafy greens experience severe moisture loss, CO2 accumulation, and chlorophyll breakdown above 24°C.'
  },
  {
    id: 'BATCH-2026-005',
    produceType: 'Tomatoes',
    temperature: 18.0,
    humidity: 65,
    lightFlux: 400,
    co2Ppm: 500,
    transitTime: 6.0,
    distance: 105,
    riskLevel: 'Low',
    riskScore: 22.1,
    recommendedAction: 'Standard route dispatch on schedule',
    explanation: 'Stable transport environment; minimal risk of rot or bruising.'
  }
];

/**
 * Single service function to request spoilage risk predictions.
 * Matches API_CONTRACT.md request and response shapes exactly.
 *
 * @param {Object} payload
 * @param {string} payload.produce_type - e.g. "Tomatoes", "Jasmine Flowers", "Rose", "Banana"
 * @param {number} payload.temperature_c - Ambient/vehicle temperature in °C
 * @param {number} payload.humidity_pct - Relative humidity percentage (0-100)
 * @param {number} payload.light_flux - Light flux intensity
 * @param {number} payload.co2_ppm - CO2 concentration in ppm
 * @param {number} payload.transit_time_hours - Remaining or elapsed transit hours
 * @param {number} payload.distance_km - Total transit distance in kilometers
 * @returns {Promise<{risk_level: 'Low'|'Medium'|'High', risk_score: number, recommended_action: string, explanation: string}>}
 */
export async function getPrediction(payload) {
  const formattedPayload = {
    produce_type: String(payload.produce_type || 'Jasmine Flowers'),
    temperature_c: Number(payload.temperature_c) || 0.0,
    humidity_pct: Number(payload.humidity_pct) || 0.0,
    light_flux: Number(payload.light_flux) || 0.0,
    co2_ppm: Number(payload.co2_ppm) || 0.0,
    distance_km: Number(payload.distance_km) || 0.0,
    transit_time_hours: Number(payload.transit_time_hours) || 0.0,
  };

  if (USE_MOCK) {
    // Simulate realistic API response latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const temp = formattedPayload.temperature_c;
    const time = formattedPayload.transit_time_hours;
    const light = formattedPayload.light_flux;
    const co2 = formattedPayload.co2_ppm;
    const produce = formattedPayload.produce_type.toLowerCase();

    const isFlower = produce.includes('rose') || produce.includes('jasmine') || produce.includes('marigold') || produce.includes('flower');

    let risk_level = 'Low';
    let risk_score = 18.5;
    let recommended_action = 'Standard route dispatch on schedule';
    let explanation = `Shipment conditions (${temp}°C, ${light} flux, ${co2} ppm CO2, ${time} hrs) are within safe parameters for ${formattedPayload.produce_type}.`;

    if (temp > 24 || (isFlower && temp > 21) || time > 12 || co2 > 1200 || light > 1200) {
      risk_level = 'High';
      risk_score = Math.min(96.0, Math.max(75.0, 75.0 + (temp - 24) * 2.5 + (time - 12) * 1.5 + (co2 - 1200) * 0.02));
      recommended_action = isFlower
        ? 'Redirect immediately to nearest cold-storage flower hub'
        : 'Rescue channel: reroute to local processing unit or nearest cold hub';
      explanation = `Elevated temperature (${temp}°C), high CO2 (${co2} ppm), or high light flux (${light}) during ${time} hrs transit pose severe spoilage risk for ${formattedPayload.produce_type}. Immediate intervention required.`;
    } else if (temp > 17 || (isFlower && temp > 15) || time > 7 || co2 > 800 || light > 800) {
      risk_level = 'Medium';
      risk_score = Math.min(74.5, Math.max(45.0, 52.0 + (temp - 17) * 2.8 + (time - 7) * 2.0));
      recommended_action = 'Prioritize express route dispatch to minimize transit delay';
      explanation = `Moderate environmental stress (${temp}°C, ${co2} ppm CO2) elevates degradation risk for ${formattedPayload.produce_type}. Expedited dispatch is recommended.`;
    }

    return {
      risk_level,
      risk_score: Number(risk_score.toFixed(1)), // 0-100 scale matching backend
      recommended_action,
      explanation,
    };
  }

  // Live Backend API Call (Phase 3 Integration matching API_CONTRACT.md)
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
      throw new Error(errorData.error || `Prediction request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      risk_level: data.risk_level,
      risk_score: Number(data.risk_score),
      recommended_action: data.recommended_action,
      explanation: data.explanation,
    };
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to prediction server at ${API_BASE_URL}. Ensure backend is running.`);
    }
    throw err;
  }
}
