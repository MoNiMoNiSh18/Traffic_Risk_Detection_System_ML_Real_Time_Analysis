from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from app.db.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    traffic_density = Column(Integer)
    horn_events_per_min = Column(Float)
    avg_speed = Column(Float)
    signal_wait_time = Column(Float)

    weather_condition = Column(String)
    road_quality_score = Column(Float)
    driver_experience_level = Column(String)
    stress_index = Column(Float)

    predicted_risk = Column(String)
    confidence = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)