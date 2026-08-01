from pathlib import Path
from app.core.config import MODEL_DIR
import joblib
import pandas as pd

model = joblib.load(MODEL_DIR / "risk_prediction_model.pkl")
weather_encoder = joblib.load(MODEL_DIR / "weather_encoder.pkl")
driver_encoder = joblib.load(MODEL_DIR / "driver_encoder.pkl")
risk_encoder = joblib.load(MODEL_DIR / "risk_encoder.pkl")
def predict(data):
    input_df = pd.DataFrame([data])
    input_df["weather_condition"] = weather_encoder.transform(
    input_df["weather_condition"])
    input_df["driver_experience_level"] = driver_encoder.transform(input_df["driver_experience_level"])
    prediction = model.predict(input_df)
    confidence = max(model.predict_proba(input_df)[0]) * 100
    predicted_risk = risk_encoder.inverse_transform(prediction)
    return {
    "predicted_risk": predicted_risk[0],
    "confidence": round(confidence, 2)
}