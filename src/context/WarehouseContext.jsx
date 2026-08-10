import React, { createContext, useContext, useState } from 'react';
import { INITIAL_WAREHOUSES, INITIAL_STOCKS, DISTANCE_MATRIX } from '../data/warehouseData';

const WarehouseContext = createContext();

export function WarehouseProvider({ children }) {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [distanceMatrix] = useState(DISTANCE_MATRIX);

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
    setWarehouses((prev) =>
      prev.map((wh) => (wh.id === id ? { ...wh, ...updatedFields } : wh))
    );
  };

  const deleteWarehouse = (id) => {
    setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
    // Also remove or reassign associated stock
    setStocks((prev) => prev.filter((stk) => stk.warehouse_id !== id));
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

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        stocks,
        distanceMatrix,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
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
