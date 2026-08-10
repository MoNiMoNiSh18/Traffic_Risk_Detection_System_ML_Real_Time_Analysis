
from app.services.prediction_service import predict_risk as predict_service
from app.schemas.prediction import PredictionRequest, PredictionResponse
from fastapi import APIRouter,Depends
from app.auth.dependencies import get_current_user
router = APIRouter(
    prefix="/api/v1", 
    tags=["Prediction"]
    )
@router.post("/predict", response_model=PredictionResponse)
def predict(
    data: PredictionRequest,
    current_user = Depends(get_current_user)
):
  return predict_service(
    data.model_dump(),
    current_user.id
)