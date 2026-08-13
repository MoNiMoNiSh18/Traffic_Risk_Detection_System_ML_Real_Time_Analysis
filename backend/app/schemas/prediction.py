from pydantic import BaseModel, Field
from typing import Literal

class PredictionRequest(BaseModel):
    traffic_density: int = Field(..., ge=0, le=100)
    horn_events_per_min: float = Field(..., ge=0)
    avg_speed: float = Field(..., ge=0, le=200)
    signal_wait_time: float = Field(..., ge=0)

    weather_condition: Literal[
        "Clear",
        "Foggy",
        "Hot",
        "Rainy"
    ]

    road_quality_score: float = Field(..., ge=0, le=10)

    driver_experience_level: Literal[
        "Beginner",
        "Intermediate",
        "Expert"
    ]

    stress_index: float = Field(..., ge=0, le=100)

    latitude: float | None = None
    longitude: float | None = None


class PredictionResponse(BaseModel):
    predicted_risk: str
    confidence: float