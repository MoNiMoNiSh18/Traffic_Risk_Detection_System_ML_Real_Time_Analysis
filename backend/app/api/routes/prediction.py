
from app.services.prediction_service import predict_risk as predict_service
from app.schemas.prediction import PredictionRequest, PredictionResponse
from fastapi import APIRouter
router = APIRouter(
    prefix="/api/v1", 
    tags=["Prediction"]
    )
@router.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    return predict_service(data.model_dump())  # FastAPI/Pydantic v2