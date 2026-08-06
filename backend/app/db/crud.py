from sqlalchemy.orm import Session
from app.db.models import Prediction,User


def create_prediction(db: Session, data: dict):

    prediction = Prediction(**data)

    db.add(prediction)

    db.commit()

    db.refresh(prediction)

    return prediction

def get_predictions(db: Session):
    return db.query(Prediction).order_by(Prediction.id.desc()).all()

def get_prediction_by_id(db: Session, prediction_id: int):
    return (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

def get_predictions_by_risk(db: Session, risk: str):
    return (
        db.query(Prediction)
        .filter(Prediction.predicted_risk == risk)
        .order_by(Prediction.id.desc())
        .all()
    )

def create_user(db: Session, data: dict):
    user = User(**data)

    db.add(user)

    db.commit()

    db.refresh(user)

    return user

def get_user_by_email(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )