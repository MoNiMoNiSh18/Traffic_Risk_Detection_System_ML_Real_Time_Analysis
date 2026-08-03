from app.ml.predictor import predict
from app.core.logger import logger
from app.db.database import SessionLocal
from app.db.crud import create_prediction

def predict_risk(data):
    logger.info("Prediction request received")

    result = predict(data)

    logger.info(f"Prediction Result: {result}")

    db = SessionLocal()

    prediction_data = {
        **data,
        **result
    }

    create_prediction(db, prediction_data)

    db.close()

    return result