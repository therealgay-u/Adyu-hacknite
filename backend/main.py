from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifacts
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
model = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
model_columns = joblib.load(os.path.join(MODEL_DIR, "model_columns.pkl"))

class ShipmentInput(BaseModel):
    produce_type: str
    temperature_c: float
    humidity_pct: float
    transit_time_hours: float
    distance_km: float
    light_flux: float | None = None
    co2_ppm: float | None = None

# Defaults for features not collected from user (used only if request omits them)
DEFAULT_LIGHT = 15.0
DEFAULT_CO2 = 350

# Exact produce categories the model was trained on (model_columns.pkl)
VALID_PRODUCE_TYPES = {
    "banana": "Banana",
    "jasmine": "Jasmine",
    "marigold": "Marigold",
    "orange": "Orange",
    "pineapple": "Pineapple",
    "rose": "Rose",
    "tomato": "Tomato",
}

def normalize_produce_type(raw: str) -> str | None:
    """
    Matches messy frontend labels ('Fresh Spinach', 'Red Roses', 'Jasmine Flowers',
    'Tomatoes') to one of the 7 trained categories. Returns None if no match,
    so the caller can flag it instead of silently zeroing every produce column.
    """
    cleaned = raw.strip().lower()
    for key, trained_name in VALID_PRODUCE_TYPES.items():
        if key in cleaned:
            return trained_name
    return None

def recommend_action(risk_level, transit_time_hours, distance_km):
    if risk_level == "High":
        if transit_time_hours > 8 or distance_km > 200:
            return "Redirect to nearest buyer/rescue channel"
        else:
            return "Prioritize dispatch immediately"
    elif risk_level == "Medium":
        return "Prioritize route, monitor closely"
    else:
        return "Proceed with standard dispatch"

@app.post("/predict")
def predict(shipment: ShipmentInput):
    input_dict = {
        "Temp": shipment.temperature_c,
        "Humid (%)": shipment.humidity_pct,
        "Light (Fux)": shipment.light_flux if shipment.light_flux is not None else DEFAULT_LIGHT,
        "CO2 (pmm)": shipment.co2_ppm if shipment.co2_ppm is not None else DEFAULT_CO2,
    }

    for col in model_columns:
        if col.startswith("produce_"):
            input_dict[col] = 0

    matched_produce = normalize_produce_type(shipment.produce_type)
    if matched_produce is None:
        return {
            "error": f"Unrecognized produce_type '{shipment.produce_type}'. "
                     f"Must match one of: {', '.join(VALID_PRODUCE_TYPES.values())}."
        }

    produce_col = f"produce_{matched_produce}"
    input_dict[produce_col] = 1

    input_df = pd.DataFrame([input_dict])
    input_df = input_df.reindex(columns=model_columns, fill_value=0)

    pred_encoded = model.predict(input_df)[0]
    pred_proba = model.predict_proba(input_df)[0]

    pred_label = label_encoder.inverse_transform([pred_encoded])[0]
    bad_index = list(label_encoder.classes_).index("Bad")
    risk_score = round(pred_proba[bad_index] * 100, 1)

    if risk_score >= 70:
        risk_level = "High"
    elif risk_score >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    recommendation = recommend_action(risk_level, shipment.transit_time_hours, shipment.distance_km)

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "recommended_action": recommendation,
        "explanation": f"Based on temperature ({shipment.temperature_c}°C) and humidity ({shipment.humidity_pct}%), model classified conditions as '{pred_label}'."
    }