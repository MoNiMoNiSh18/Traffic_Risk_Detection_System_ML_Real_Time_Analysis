from fastapi import APIRouter, HTTPException, Depends
from app.auth.dependencies import get_current_user
from app.db.database import SessionLocal
from app.db.models import Prediction
from app.db.crud import (
    get_predictions,
    get_prediction_by_id,
    get_predictions_by_risk,
    get_predictions_by_user
)

router = APIRouter(
    prefix="/api/v1",
    tags=["History"]
)


@router.get("/history")
def get_history(
    current_user=Depends(get_current_user)
):
    db = SessionLocal()

    predictions = get_predictions_by_user(
        db,
        current_user.id
    )

    db.close()

    return predictions
@router.get("/history/{prediction_id}")
def get_prediction(prediction_id: int):
    db = SessionLocal()

    prediction = get_prediction_by_id(db, prediction_id)

    db.close()

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return prediction

@router.get("/history/risk/{risk}")
def get_risk_history(risk: str):
    db = SessionLocal()

    predictions = get_predictions_by_risk(db, risk)

    db.close()

    return predictions

@router.get("/regional-risk")
def get_regional_risk(
    current_user=Depends(get_current_user)
):
    db = SessionLocal()

    predictions = (
        db.query(Prediction)
        .filter(
            Prediction.user_id == current_user.id,
            Prediction.latitude.isnot(None),
            Prediction.longitude.isnot(None)
        )
        .all()
    )

    db.close()

    if not predictions:
        return {
            "regional_risk": "Unknown",
            "total_predictions": 0,
            "high_risk": 0,
            "medium_risk": 0,
            "low_risk": 0,
            "center_latitude": None,
            "center_longitude": None
        }

    high_risk = sum(
        1 for prediction in predictions
        if prediction.predicted_risk == "High"
    )

    medium_risk = sum(
        1 for prediction in predictions
        if prediction.predicted_risk == "Medium"
    )

    low_risk = sum(
        1 for prediction in predictions
        if prediction.predicted_risk == "Low"
    )

    total = len(predictions)

    # Determine regional risk
    if high_risk > total / 2:
        regional_risk = "High"
    elif high_risk + medium_risk > total / 2:
        regional_risk = "Medium"
    else:
        regional_risk = "Low"

    center_latitude = sum(
        prediction.latitude for prediction in predictions
    ) / total

    center_longitude = sum(
        prediction.longitude for prediction in predictions
    ) / total

    return {
        "regional_risk": regional_risk,
        "total_predictions": total,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk,
        "center_latitude": center_latitude,
        "center_longitude": center_longitude
    }