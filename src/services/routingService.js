/**
 * Routing Service for selecting candidate safe warehouses from the static Distance Matrix.
 * Used client-side before calling /predict during warehouse environmental monitoring.
 */

// Thresholds for safe warehouse receiving conditions
const SAFE_MAX_TEMP_C = 22.0;
const SAFE_MAX_HUMIDITY_PCT = 82;

/**
 * Returns candidate warehouses (excluding origin) filtered to acceptable environmental conditions
 * and available capacity, sorted by distance ascending.
 *
 * @param {string} fromWarehouseId - Origin warehouse ID
 * @param {Array<Object>} warehouses - List of all warehouse objects
 * @param {Array<Object>} distanceMatrix - Static distance matrix array
 * @returns {Array<Object>} Candidate warehouses sorted by distance_km ascending, with distance_km and avg_travel_hours attached.
 */
export function getSafeWarehouses(fromWarehouseId, warehouses = [], distanceMatrix = []) {
  if (!fromWarehouseId || !warehouses || warehouses.length === 0) {
    return [];
  }

  return warehouses
    .filter((wh) => {
      // Exclude origin warehouse
      if (wh.id === fromWarehouseId) return false;

      // Filter to acceptable conditions and capacity
      const isTempSafe = wh.current_temp <= SAFE_MAX_TEMP_C;
      const isHumiditySafe = wh.current_humidity <= SAFE_MAX_HUMIDITY_PCT;
      const isNotCritical = wh.status !== 'Critical';
      const hasCapacity = (wh.capacity || 0) > 0;

      return isTempSafe && isHumiditySafe && isNotCritical && hasCapacity;
    })
    .map((wh) => {
      // Find distance & travel time entry from distanceMatrix
      const route = distanceMatrix.find(
        (entry) =>
          (entry.from_warehouse_id === fromWarehouseId && entry.to_warehouse_id === wh.id) ||
          (entry.from_warehouse_id === wh.id && entry.to_warehouse_id === fromWarehouseId)
      );

      return {
        ...wh,
        distance_km: route ? route.distance_km : 9999,
        avg_travel_hours: route ? route.avg_travel_hours : 99,
      };
    })
    .filter((wh) => wh.distance_km < 9999) // Ensure a valid route exists
    .sort((a, b) => a.distance_km - b.distance_km);
}

/**
 * Returns the nearest candidate safe warehouse with its distance_km and avg_travel_hours,
 * or null if none qualify.
 *
 * @param {string} fromWarehouseId
 * @param {Array<Object>} warehouses
 * @param {Array<Object>} distanceMatrix
 * @returns {Object|null} Top candidate warehouse object containing distance_km & avg_travel_hours, or null
 */
export function getNearestSafeWarehouse(fromWarehouseId, warehouses = [], distanceMatrix = []) {
  const safeCandidates = getSafeWarehouses(fromWarehouseId, warehouses, distanceMatrix);
  return safeCandidates.length > 0 ? safeCandidates[0] : null;
}
