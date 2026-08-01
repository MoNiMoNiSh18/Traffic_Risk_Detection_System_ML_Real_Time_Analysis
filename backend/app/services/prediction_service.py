from app.ml.predictor import predict
from app.core.logger import logger

def predict_risk(data):
    logger.info("Prediction request received")

    result = predict(data)

    logger.info(f"Prediction Result: {result}")

    return result