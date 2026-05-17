import joblib
import pandas as pd

model = joblib.load("models/risk_prediction_model.pkl")
weather_encoder = joblib.load("models/weather_encoder.pkl")
driver_encoder = joblib.load("models/driver_encoder.pkl")
risk_encoder = joblib.load("models/risk_encoder.pkl")

new_data = {
    "traffic_density": [95],
    "horn_events_per_min": [10.5],
    "avg_speed": [82],
    "signal_wait_time": [50],
    "weather_condition": ["Foggy"],
    "road_quality_score": [3.5],
    "driver_experience_level": ["Beginner"],
    "stress_index": [85]
}

input_df = pd.DataFrame(new_data)
input_df["weather_condition"] = weather_encoder.transform(
    input_df["weather_condition"]
)
input_df["driver_experience_level"] = driver_encoder.transform(
    input_df["driver_experience_level"]
)

prediction = model.predict(input_df)
predicted_risk = risk_encoder.inverse_transform(prediction)
print("Predicted Risk Level:", predicted_risk[0])