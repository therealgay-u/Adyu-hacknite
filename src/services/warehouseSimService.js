/**
 * Warehouse Environmental Condition Simulation Service.
 *
 * Provides:
 * 1. Random ambient drift ticker (~5s) for current_temp (2-35°C) and current_humidity (50-98%).
 * 2. triggerCalamity(warehouseId) function for instant on-demand demoing of severe conditions.
 */

// Safe clamping thresholds
const TEMP_MIN = 2.0;
const TEMP_MAX = 35.0;
const HUMIDITY_MIN = 50;
const HUMIDITY_MAX = 98;

/**
 * Calculates minor random ambient drift for a single warehouse.
 * @param {Object} warehouse
 * @returns {{ current_temp: number, current_humidity: number }}
 */
export function driftWarehouseConditions(warehouse) {
  // Small random deltas
  const tempDelta = (Math.random() - 0.48) * 0.8; // slightly asymmetrical for organic drift
  const humidityDelta = Math.round((Math.random() - 0.48) * 2.0);

  const newTemp = Math.min(
    TEMP_MAX,
    Math.max(TEMP_MIN, parseFloat((warehouse.current_temp + tempDelta).toFixed(1)))
  );

  const newHumidity = Math.min(
    HUMIDITY_MAX,
    Math.max(HUMIDITY_MIN, Math.round(warehouse.current_humidity + humidityDelta))
  );

  // Update status label based on temp & humidity thresholds
  let status = 'Optimal';
  if (newTemp > 28.0 || newHumidity > 88) {
    status = 'Critical';
  } else if (newTemp > 21.0 || newHumidity > 76) {
    status = 'Warning';
  }

  return {
    current_temp: newTemp,
    current_humidity: newHumidity,
    status,
  };
}

/**
 * Pushes a target warehouse into severe failure range immediately for reliable on-demand demoing.
 *
 * @param {string} warehouseId
 * @param {function(string, Object): void} updateWarehouseCallback - Context update function
 */
export function triggerCalamity(warehouseId, updateWarehouseCallback) {
  const severeConditions = {
    current_temp: 34.5,
    current_humidity: 96,
    light_flux: 1250,
    co2_ppm: 1400,
    status: 'Critical',
  };

  if (updateWarehouseCallback && typeof updateWarehouseCallback === 'function') {
    updateWarehouseCallback(warehouseId, severeConditions);
  }

  return severeConditions;
}

/**
 * Starts ambient background ticker that randomly drifts active warehouses.
 *
 * @param {Array<Object>} warehouses
 * @param {function(string, Object): void} updateWarehouseCallback
 * @param {number} [intervalMs=5000]
 * @returns {function(): void} Stop function to clear interval
 */
export function startSimTicker(warehousesOrFn, updateWarehouseCallback, intervalMs = 5000) {
  const timer = setInterval(() => {
    const warehouses = typeof warehousesOrFn === 'function' ? warehousesOrFn() : warehousesOrFn;
    if (!warehouses || warehouses.length === 0) return;

    // Pick 1 to 2 warehouses to drift per tick for realistic updates
    const countToDrift = Math.min(warehouses.length, Math.floor(Math.random() * 2) + 1);
    const shuffled = [...warehouses].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, countToDrift);

    selected.forEach((wh) => {
      const updatedFields = driftWarehouseConditions(wh);
      updateWarehouseCallback(wh.id, updatedFields);
    });
  }, intervalMs);

  return () => clearInterval(timer);
}
