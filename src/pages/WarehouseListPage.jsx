import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import Button from '../components/Button';
import StatField from '../components/StatField';
import RiskBadge from '../components/RiskBadge';

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

export default function WarehouseListPage() {
  const {
    warehouses,
    stocks,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    addStock,
    updateStock,
    deleteStock,
  } = useWarehouse();

  // Modals state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null); // null = add, object = edit

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null); // null = add, object = edit
  const [selectedWarehouseForStock, setSelectedWarehouseForStock] = useState('');

  // Warehouse Form State
  const [warehouseFormData, setWarehouseFormData] = useState({
    name: '',
    current_temp: 18.0,
    current_humidity: 70,
    light_flux: 400,
    co2_ppm: 500,
    capacity: 2000,
    status: 'Optimal',
  });

  // Stock Form State
  const [stockFormData, setStockFormData] = useState({
    produce_type: 'Jasmine Flowers',
    quantity: 500,
    warehouse_id: '',
    temperature_c: 18.0,
    humidity_pct: 70,
    light_flux: 400,
    co2_ppm: 500,
    risk_level: 'Low',
    risk_score: 20.0,
  });

  // Open Add Warehouse Modal
  const handleOpenAddWarehouse = () => {
    setEditingWarehouse(null);
    setWarehouseFormData({
      name: '',
      current_temp: 18.0,
      current_humidity: 70,
      light_flux: 400,
      co2_ppm: 500,
      capacity: 2000,
      status: 'Optimal',
    });
    setIsWarehouseModalOpen(true);
  };

  // Open Edit Warehouse Modal
  const handleOpenEditWarehouse = (wh) => {
    setEditingWarehouse(wh);
    setWarehouseFormData({
      name: wh.name,
      current_temp: wh.current_temp,
      current_humidity: wh.current_humidity,
      light_flux: wh.light_flux || 400,
      co2_ppm: wh.co2_ppm || 500,
      capacity: wh.capacity,
      status: wh.status || 'Optimal',
    });
    setIsWarehouseModalOpen(true);
  };

  // Save Warehouse Form
  const handleSaveWarehouse = (e) => {
    e.preventDefault();
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, {
        name: warehouseFormData.name,
        current_temp: parseFloat(warehouseFormData.current_temp),
        current_humidity: parseFloat(warehouseFormData.current_humidity),
        light_flux: parseFloat(warehouseFormData.light_flux),
        co2_ppm: parseFloat(warehouseFormData.co2_ppm),
        capacity: parseInt(warehouseFormData.capacity, 10),
        status: warehouseFormData.status,
      });
    } else {
      addWarehouse({
        name: warehouseFormData.name,
        current_temp: parseFloat(warehouseFormData.current_temp),
        current_humidity: parseFloat(warehouseFormData.current_humidity),
        light_flux: parseFloat(warehouseFormData.light_flux),
        co2_ppm: parseFloat(warehouseFormData.co2_ppm),
        capacity: parseInt(warehouseFormData.capacity, 10),
        status: warehouseFormData.status,
      });
    }
    setIsWarehouseModalOpen(false);
  };

  // Open Add Stock Modal
  const handleOpenAddStock = (defaultWarehouseId = '') => {
    setEditingStock(null);
    setSelectedWarehouseForStock(defaultWarehouseId || (warehouses[0]?.id || ''));
    setStockFormData({
      produce_type: 'Jasmine Flowers',
      quantity: 500,
      warehouse_id: defaultWarehouseId || (warehouses[0]?.id || ''),
      temperature_c: 18.0,
      humidity_pct: 70,
      light_flux: 400,
      co2_ppm: 500,
      risk_level: 'Low',
      risk_score: 20.0,
    });
    setIsStockModalOpen(true);
  };

  // Open Edit Stock Modal
  const handleOpenEditStock = (stk) => {
    setEditingStock(stk);
    setSelectedWarehouseForStock(stk.warehouse_id);
    setStockFormData({
      produce_type: stk.produce_type,
      quantity: stk.quantity,
      warehouse_id: stk.warehouse_id,
      temperature_c: stk.temperature_c || 18.0,
      humidity_pct: stk.humidity_pct || 70,
      light_flux: stk.light_flux || 400,
      co2_ppm: stk.co2_ppm || 500,
      risk_level: stk.risk_level || 'Low',
      risk_score: stk.risk_score || 20.0,
    });
    setIsStockModalOpen(true);
  };

  // Save Stock Form
  const handleSaveStock = (e) => {
    e.preventDefault();
    if (editingStock) {
      updateStock(editingStock.id, {
        produce_type: stockFormData.produce_type,
        quantity: parseInt(stockFormData.quantity, 10),
        warehouse_id: selectedWarehouseForStock,
        temperature_c: parseFloat(stockFormData.temperature_c),
        humidity_pct: parseFloat(stockFormData.humidity_pct),
        light_flux: parseFloat(stockFormData.light_flux),
        co2_ppm: parseFloat(stockFormData.co2_ppm),
      });
    } else {
      addStock({
        produce_type: stockFormData.produce_type,
        quantity: parseInt(stockFormData.quantity, 10),
        warehouse_id: selectedWarehouseForStock,
        temperature_c: parseFloat(stockFormData.temperature_c),
        humidity_pct: parseFloat(stockFormData.humidity_pct),
        light_flux: parseFloat(stockFormData.light_flux),
        co2_ppm: parseFloat(stockFormData.co2_ppm),
      });
    }
    setIsStockModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="bg-surface p-5 rounded-card border border-slate-light flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-navy">Cold Storage Warehouse Network</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Manage regional warehouse nodes, monitor active storage parameters, and assign stock batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => handleOpenAddStock()} className="text-xs py-2">
            + Add Stock Batch
          </Button>
          <Button variant="primary" onClick={handleOpenAddWarehouse} className="text-xs py-2">
            + New Warehouse Node
          </Button>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const whStocks = stocks.filter((s) => s.warehouse_id === wh.id);
          const totalStockQty = whStocks.reduce((sum, item) => sum + item.quantity, 0);
          const utilizationPct = Math.min(100, Math.round((totalStockQty / wh.capacity) * 100));

          return (
            <div key={wh.id} className="bg-surface rounded-card border border-slate-light p-5 space-y-4 shadow-xs flex flex-col justify-between">
              {/* Warehouse Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{wh.id}</span>
                    <h3 className="text-base font-bold text-slate-navy leading-snug">{wh.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-btn border ${
                      wh.status === 'Critical'
                        ? 'bg-red-100 text-risk-high border-risk-high/30'
                        : wh.status === 'Warning'
                        ? 'bg-amber-100 text-risk-medium border-risk-medium/30'
                        : 'bg-emerald-100 text-risk-low border-risk-low/30'
                    }`}
                  >
                    {wh.status}
                  </span>
                </div>

                {/* Ambient Sensor Reading Summary */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-background p-3 rounded-btn border border-slate-light">
                  <StatField label="Temp" value={`${wh.current_temp}°C`} />
                  <StatField label="Humidity" value={`${wh.current_humidity}%`} />
                  <StatField label="CO2" value={`${wh.co2_ppm || 500} ppm`} />
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-navy">
                    <span>Capacity Utilization</span>
                    <span>{utilizationPct}% ({totalStockQty} / {wh.capacity} crates)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-light rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        utilizationPct > 85 ? 'bg-risk-high' : utilizationPct > 65 ? 'bg-risk-medium' : 'bg-slate-navy'
                      }`}
                      style={{ width: `${utilizationPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stock Batches List */}
              <div className="border-t border-slate-light pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-navy">Stored Inventory ({whStocks.length})</span>
                  <button
                    onClick={() => handleOpenAddStock(wh.id)}
                    className="text-[11px] font-semibold text-slate-navy hover:underline"
                  >
                    + Assign Stock
                  </button>
                </div>

                {whStocks.length === 0 ? (
                  <p className="text-xs text-text-muted italic py-1">No active stock assigned to this warehouse.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {whStocks.map((stk) => (
                      <div
                        key={stk.id}
                        className="flex items-center justify-between p-2 rounded-btn bg-slate-50 border border-slate-light text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-navy block">{stk.produce_type}</span>
                          <span className="text-[10px] text-text-muted">{stk.quantity} crates • {stk.arrived_at}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RiskBadge level={stk.risk_level} className="text-[10px] px-2 py-0.5" />
                          <button
                            onClick={() => handleOpenEditStock(stk)}
                            className="text-text-muted hover:text-slate-navy font-bold px-1"
                            title="Edit Stock"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteStock(stk.id)}
                            className="text-text-muted hover:text-risk-high font-bold px-1"
                            title="Delete Stock"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warehouse Footer Controls */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-light pt-3">
                <Button variant="secondary" onClick={() => handleOpenEditWarehouse(wh)} className="text-xs py-1 px-3">
                  Edit Node
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => deleteWarehouse(wh.id)}
                  className="text-xs py-1 px-3 text-risk-high hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Modal (Add / Edit) */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 bg-slate-navy/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-card border border-slate-light p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-navy">
              {editingWarehouse ? 'Edit Warehouse Node' : 'Add New Warehouse Node'}
            </h3>

            <form onSubmit={handleSaveWarehouse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-navy mb-1">Warehouse Name</label>
                <input
                  type="text"
                  required
                  value={warehouseFormData.name}
                  onChange={(e) => setWarehouseFormData({ ...warehouseFormData, name: e.target.value })}
                  placeholder="e.g. Mysuru Flower Terminal"
                  className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">Ambient Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={warehouseFormData.current_temp}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, current_temp: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={warehouseFormData.current_humidity}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, current_humidity: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">Light Flux</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={warehouseFormData.light_flux}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, light_flux: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">CO2 PPM</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={warehouseFormData.co2_ppm}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, co2_ppm: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">Capacity (Crates)</label>
                  <input
                    type="number"
                    required
                    value={warehouseFormData.capacity}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, capacity: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-navy mb-1">Status</label>
                  <select
                    value={warehouseFormData.status}
                    onChange={(e) => setWarehouseFormData({ ...warehouseFormData, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                  >
                    <option value="Optimal">Optimal</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-light">
                <Button variant="secondary" onClick={() => setIsWarehouseModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs">
                  Save Warehouse
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal (Add / Edit) */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-slate-navy/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-card border border-slate-light p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-navy">
              {editingStock ? 'Edit Stock Batch' : 'Assign New Stock Batch'}
            </h3>

            <form onSubmit={handleSaveStock} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-navy mb-1">Assign to Warehouse</label>
                <select
                  value={selectedWarehouseForStock}
                  onChange={(e) => setSelectedWarehouseForStock(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-navy mb-1">Produce / Flower Commodity</label>
                <select
                  value={stockFormData.produce_type}
                  onChange={(e) => setStockFormData({ ...stockFormData, produce_type: e.target.value })}
                  required
                  className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                >
                  {PRODUCE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-navy mb-1">Quantity (Crates/KG)</label>
                <input
                  type="number"
                  required
                  value={stockFormData.quantity}
                  onChange={(e) => setStockFormData({ ...stockFormData, quantity: e.target.value })}
                  className="w-full h-10 px-3 rounded-btn border border-slate-light text-xs text-slate-navy focus:ring-2 focus:ring-slate-navy"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-light">
                <Button variant="secondary" onClick={() => setIsStockModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs">
                  Save Stock Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
