from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
app = FastAPI()

model = joblib.load("models/risk_prediction_model.pkl")

weather_encoder = joblib.load("models/weather_encoder.pkl")

driver_encoder = joblib.load("models/driver_encoder.pkl")

risk_encoder = joblib.load("models/risk_encoder.pkl")

class TrafficData(BaseModel):
    traffic_density: int
    horn_events_per_min: float
    avg_speed: float
    signal_wait_time: float
    weather_condition: str
    road_quality_score: float
    driver_experience_level: str
    stress_index: float

@app.get("/")
def home():
    return {"message": "Traffic Risk Prediction API Running"}

@app.post("/predict")
def predict_risk(data: TrafficData):

    input_data = pd.DataFrame([{
        "traffic_density": data.traffic_density,
        "horn_events_per_min": data.horn_events_per_min,
        "avg_speed": data.avg_speed,
        "signal_wait_time": data.signal_wait_time,
        "weather_condition": data.weather_condition,
        "road_quality_score": data.road_quality_score,
        "driver_experience_level": data.driver_experience_level,
        "stress_index": data.stress_index
    }])

    input_data["weather_condition"] = weather_encoder.transform(
        input_data["weather_condition"]
    )

    input_data["driver_experience_level"] = driver_encoder.transform(
        input_data["driver_experience_level"]
    )

    prediction = model.predict(input_data)
    predicted_risk = risk_encoder.inverse_transform(prediction)

    return {
        "predicted_risk": predicted_risk[0]
    }