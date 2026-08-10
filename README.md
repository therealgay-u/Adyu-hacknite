# Predictive Spoilage + Smart Dispatch

A web dashboard that predicts spoilage risk for perishable shipments and
warehouse stock — produce **and** flowers (roses, marigold, jasmine) — and
recommends what to do about it: redirect, prioritize dispatch, or route to a
rescue channel.

Built for the **Smart Supply Chain** hackathon track. Target user: an
Indian wholesale/warehouse manager who is non-technical and time-pressed.

## Features

- **Dashboard** — card grid of shipments/stock, color-coded by risk
- **Shipment form** — enter produce type, temperature, humidity, light,
  CO2, transit time, and distance to get a risk prediction
- **Prediction page** — risk level/score plus a plain-language recommended
  action
- **What-if simulator** — six sliders drive a live risk prediction
- **Warehouse + stock inventory** — CRUD for multiple warehouses and their
  stock
- **Simulated environmental monitoring** — continuously simulated
  temperature/humidity/etc. per warehouse, with automatic alerts when
  conditions turn severe
- **Risk Radar** — network visualization of warehouses, pulsing on alert
- **Greedy routing** — recommends the nearest currently-safe warehouse
  using a static distance/travel-time table (no live Maps/Weather API)
- **Rescue Marketplace** — shown when no safe warehouse candidate exists

## Tech stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** FastAPI, serving a scikit-learn classifier via `/predict`
- **ML:** classifier trained on produce type, temperature, humidity, light
  flux, and CO2 → Good/Bad via `predict_proba`; risk score is the
  probability of "Bad" scaled to 0–100
- Routing and warehouse-condition simulation run entirely client-side
  (`src/services/routingService.js`, `src/services/warehouseSimService.js`)
  — no backend involvement

## Project structure

```
temp/
├── backend/
│   ├── main.py              # FastAPI app, /predict endpoint
│   ├── model/                # model.pkl, label_encoder.pkl, model_columns.pkl
│   └── requirements.txt
├── src/
│   ├── components/           # RiskBadge, ShipmentCard, RiskRadar, RescueMarketplace, ...
│   ├── context/               # WarehouseContext (global warehouse/stock state)
│   ├── data/                  # warehouseData.js (static seed data / distance matrix)
│   ├── pages/                 # DashboardPage, ShipmentFormPage, PredictionResultPage,
│   │                           # WhatIfSimulatorPage, WarehouseListPage, ...
│   └── services/
│       ├── predictService.js  # only place that calls the backend; USE_MOCK toggle
│       ├── routingService.js  # nearest-safe-warehouse selection
│       └── warehouseSimService.js  # simulated environmental conditions
├── API_CONTRACT.md           # shared frontend/backend request & response shapes
├── CLAUDE.md                 # project context and rules for AI-assisted coding
├── COMPONENTS.md             # component conventions
├── DECISIONS.md              # log of non-obvious decisions
├── PRD.md                    # product requirements
├── TODO.md                   # current task list
└── design.md                 # design system (colors, fonts, component styles)
```

## Getting started

### Frontend

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev
```

By default the frontend can run against a mock prediction response — see
`USE_MOCK` in `src/services/predictService.js`. Set it to `false` once the
backend is confirmed live.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

The API serves on `http://localhost:8000` by default. Enable CORS is
already configured to allow all origins for local development.

## API

See [`API_CONTRACT.md`](./API_CONTRACT.md) for the full request/response
shapes. Summary:

**`POST /predict`**

Request:
```json
{
  "produce_type": "Orange | Pineapple | Banana | Tomato | Rose | Marigold | Jasmine",
  "temperature_c": 0.0,
  "humidity_pct": 0.0,
  "light_flux": 0.0,
  "co2_ppm": 0.0,
  "distance_km": 0.0,
  "transit_time_hours": 0.0
}
```

Response:
```json
{
  "risk_level": "Low | Medium | High",
  "risk_score": 72.7,
  "recommended_action": "string",
  "explanation": "string"
}
```

`distance_km` and `transit_time_hours` aren't ML features — they feed the
backend's rule-based recommendation layer. For warehouse monitoring, these
are computed client-side (nearest safe candidate) before calling
`/predict`; for the shipment form, they're the shipment's own journey
values.

## Contributing / project conventions

- Frontend and backend are owned separately (see `CLAUDE.md`) — don't
  cross scope without asking.
- All backend calls go through `src/services/predictService.js` — never
  call `fetch()` directly from a component.
- Follow `design.md` and `COMPONENTS.md` for styling — don't invent new
  colors, fonts, or component patterns.
- Check `TODO.md` before starting work, and update it when done.
- Log non-obvious decisions in `DECISIONS.md`.

## Out of scope (MVP)

Live Maps/Weather APIs, user accounts/auth, historical analytics/reporting,
dark mode. n8n automation, Mistral-generated explanations, and Comparison
Mode are stretch goals only.
