from fastapi import APIRouter, HTTPException, Depends
from app.auth.dependencies import get_current_user
from app.db.database import SessionLocal
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