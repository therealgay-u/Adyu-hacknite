import React, { useState } from 'react';
import SidebarNav from './components/SidebarNav';
import TopBar from './components/TopBar';
import DashboardPage from './pages/DashboardPage';
import ShipmentFormPage from './pages/ShipmentFormPage';
import PredictionResultPage from './pages/PredictionResultPage';
import WarehouseListPage from './pages/WarehouseListPage';
import { WarehouseProvider } from './context/WarehouseContext';
import { INITIAL_MOCK_SHIPMENTS } from './services/predictService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState(INITIAL_MOCK_SHIPMENTS);
  const [activePrediction, setActivePrediction] = useState(null);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
  };

  // Called when ShipmentFormPage completes prediction evaluation
  const handlePredictionComplete = (result, payload) => {
    setActivePrediction({ result, payload });

    // Append new shipment batch to local state for live dashboard updates
    const newBatchId = `BATCH-${new Date().getFullYear()}-00${shipments.length + 1}`;
    const newShipment = {
      id: newBatchId,
      produceType: payload.produce_type,
      temperature: payload.temperature_c,
      humidity: payload.humidity_pct,
      lightFlux: payload.light_flux,
      co2Ppm: payload.co2_ppm,
      transitTime: payload.transit_time_hours,
      distance: payload.distance_km,
      riskLevel: result.risk_level,
      riskScore: result.risk_score,
      recommendedAction: result.recommended_action,
      explanation: result.explanation,
    };

    setShipments((prev) => [newShipment, ...prev]);
    setActiveTab('prediction');
  };

  // Called when user clicks a ShipmentCard on Dashboard
  const handleSelectShipmentFromCard = (shipment) => {
    setActivePrediction({
      result: {
        risk_level: shipment.riskLevel,
        risk_score: shipment.riskScore,
        recommended_action: shipment.recommendedAction,
        explanation: shipment.explanation,
      },
      payload: {
        produce_type: shipment.produceType,
        temperature_c: shipment.temperature,
        humidity_pct: shipment.humidity,
        light_flux: shipment.lightFlux || 400,
        co2_ppm: shipment.co2Ppm || 500,
        transit_time_hours: shipment.transitTime,
        distance_km: shipment.distance,
      },
    });
    setActiveTab('prediction');
  };

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'shipments':
        return 'Shipment Assessment';
      case 'prediction':
        return 'Prediction Result';
      case 'warehouses':
        return 'Warehouse Network & Inventory';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Live overview of active perishable shipments and spoilage risks';
      case 'shipments':
        return 'Register produce and flower batches for real-time spoilage risk prediction';
      case 'prediction':
        return 'Detailed spoilage risk breakdown and smart dispatch recommendation';
      case 'warehouses':
        return 'Manage cold storage nodes, environmental sensor states, and inventory stock CRUD';
      default:
        return '';
    }
  };

  return (
    <WarehouseProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar Navigation */}
        <SidebarNav activeTab={activeTab} onSelectTab={handleTabSelect} />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <TopBar title={getPageTitle(activeTab)} subtitle={getPageSubtitle(activeTab)} />

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && (
                <DashboardPage
                  shipments={shipments}
                  onSelectShipment={handleSelectShipmentFromCard}
                  onNavigateToForm={() => handleTabSelect('shipments')}
                />
              )}

              {activeTab === 'shipments' && (
                <ShipmentFormPage onPredictionComplete={handlePredictionComplete} />
              )}

              {activeTab === 'prediction' && (
                <PredictionResultPage
                  predictionResult={activePrediction?.result}
                  payload={activePrediction?.payload}
                  onReset={() => handleTabSelect('shipments')}
                  onGoToDashboard={() => handleTabSelect('dashboard')}
                />
              )}


              {activeTab === 'warehouses' && <WarehouseListPage />}
            </div>
          </main>
        </div>
      </div>
    </WarehouseProvider>
  );
}
