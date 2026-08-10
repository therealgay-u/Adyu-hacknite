import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_WAREHOUSES, INITIAL_STOCKS, DISTANCE_MATRIX } from '../data/warehouseData';
import { getPrediction } from '../services/predictService';
import { startSimTicker, triggerCalamity as simTriggerCalamity } from '../services/warehouseSimService';
import { getNearestSafeWarehouse } from '../services/routingService';

const WarehouseContext = createContext();

export function WarehouseProvider({ children }) {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [distanceMatrix] = useState(DISTANCE_MATRIX);

  // Keep refs for current state to ensure async monitoring loop always accesses fresh state
  const warehousesRef = useRef(warehouses);
  warehousesRef.current = warehouses;

  const stocksRef = useRef(stocks);
  stocksRef.current = stocks;

  /**
   * Re-evaluates risk predictions for all stock items residing in a specific warehouse
   * after its environmental conditions change.
   *
   * @param {string} warehouseId
   * @param {Object} updatedWarehouse
   * @param {Array<Object>} currentWarehouses
   */
  const reevaluateStockForWarehouse = async (warehouseId, updatedWarehouse, currentWarehouses) => {
    const candidate = getNearestSafeWarehouse(warehouseId, currentWarehouses, distanceMatrix);

    const distance_km = candidate ? candidate.distance_km : 0;
    const transit_time_hours = candidate ? candidate.avg_travel_hours : 0;

    const affectedStocks = stocksRef.current.filter((stk) => stk.warehouse_id === warehouseId);
    if (affectedStocks.length === 0) return;

    try {
      const updatedStockPromises = affectedStocks.map(async (stk) => {
        const payload = {
          produce_type: stk.produce_type,
          temperature_c: updatedWarehouse.current_temp,
          humidity_pct: updatedWarehouse.current_humidity,
          distance_km,
          transit_time_hours,
          ...(stk.light_flux !== undefined
            ? { light_flux: stk.light_flux }
            : { light_flux: updatedWarehouse.light_flux }),
          ...(stk.co2_ppm !== undefined
            ? { co2_ppm: stk.co2_ppm }
            : { co2_ppm: updatedWarehouse.co2_ppm }),
        };

        const prediction = await getPrediction(payload);
        const action = prediction.recommended_action || '';
        const rescueEligible =
          action.includes('rescue channel') || action.toLowerCase().includes('rescue');

        return {
          ...stk,
          temperature_c: updatedWarehouse.current_temp,
          humidity_pct: updatedWarehouse.current_humidity,
          risk_level: prediction.risk_level,
          risk_score: prediction.risk_score,
          recommended_action: prediction.recommended_action,
          explanation: prediction.explanation,
          candidateWarehouseId: candidate ? candidate.id : null,
          candidateWarehouseName: candidate ? candidate.name : null,
          candidateDistanceKm: candidate ? candidate.distance_km : 0,
          candidateTransitHours: candidate ? candidate.avg_travel_hours : 0,
          rescueEligible,
        };
      });

      const updatedItems = await Promise.all(updatedStockPromises);

      setStocks((prevStocks) =>
        prevStocks.map((stk) => {
          const match = updatedItems.find((u) => u.id === stk.id);
          return match ? match : stk;
        })
      );
    } catch (err) {
      console.error(`Failed to re-evaluate prediction for warehouse ${warehouseId}:`, err);
    }
  };

  // Warehouse CRUD
  const addWarehouse = (warehouseData) => {
    const newId = `WH-NEW-${Date.now().toString().slice(-4)}`;
    const newWarehouse = {
      id: newId,
      status: 'Optimal',
      current_temp: 18.0,
      current_humidity: 70,
      light_flux: 400,
      co2_ppm: 500,
      capacity: 2000,
      ...warehouseData,
    };
    setWarehouses((prev) => [newWarehouse, ...prev]);
    return newWarehouse;
  };

  const updateWarehouse = (id, updatedFields) => {
    setWarehouses((prevWarehouses) => {
      const nextWarehouses = prevWarehouses.map((wh) =>
        wh.id === id ? { ...wh, ...updatedFields } : wh
      );
      const updatedWh = nextWarehouses.find((w) => w.id === id);
      if (updatedWh) {
        reevaluateStockForWarehouse(id, updatedWh, nextWarehouses);
      }
      return nextWarehouses;
    });
  };

  const deleteWarehouse = (id) => {
    setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
    setStocks((prev) => prev.filter((stk) => stk.warehouse_id !== id));
  };

  /**
   * On-demand trigger for severe environmental failure in target warehouse
   * @param {string} warehouseId
   */
  const triggerCalamity = (warehouseId) => {
    simTriggerCalamity(warehouseId, (id, severeFields) => {
      updateWarehouse(id, severeFields);
    });
  };

  // Stock CRUD
  const addStock = (stockData) => {
    const newId = `STK-${Date.now().toString().slice(-4)}`;
    const newStock = {
      id: newId,
      arrived_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      temperature_c: 18.0,
      humidity_pct: 70,
      light_flux: 400,
      co2_ppm: 500,
      risk_level: 'Low',
      risk_score: 20.0,
      ...stockData,
    };
    setStocks((prev) => [newStock, ...prev]);

    // Immediately trigger prediction evaluation for new stock item
    const targetWh = warehousesRef.current.find((w) => w.id === newStock.warehouse_id);
    if (targetWh) {
      reevaluateStockForWarehouse(newStock.warehouse_id, targetWh, warehousesRef.current);
    }
    return newStock;
  };

  const updateStock = (id, updatedFields) => {
    setStocks((prev) =>
      prev.map((stk) => (stk.id === id ? { ...stk, ...updatedFields } : stk))
    );
  };

  const deleteStock = (id) => {
    setStocks((prev) => prev.filter((stk) => stk.id !== id));
  };

  const getWarehouseById = (id) => warehouses.find((w) => w.id === id);

  const getStocksByWarehouseId = (warehouseId) =>
    stocks.filter((stk) => stk.warehouse_id === warehouseId);

  // Background simulation ticker (~5s ambient drift)
  useEffect(() => {
    const stopTicker = startSimTicker(
      () => warehousesRef.current,
      (whId, updatedFields) => {
        updateWarehouse(whId, updatedFields);
      },
      5000
    );

    return () => stopTicker();
  }, []);

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        stocks,
        distanceMatrix,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        triggerCalamity,
        addStock,
        updateStock,
        deleteStock,
        getWarehouseById,
        getStocksByWarehouseId,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}
