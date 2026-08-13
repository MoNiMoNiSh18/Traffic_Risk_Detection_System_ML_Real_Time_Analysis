# Traffic Risk Detection System: Machine Learning and Real-Time Based

## Overview

The Traffic Risk Detection System is an AI-based application that uses Machine Learning to predict traffic risk levels based on traffic, road, environmental, and driver-related conditions.

The system analyzes input parameters such as traffic density, average speed, weather condition, road quality, driver experience, and stress level to classify the current traffic risk as Low, Medium, or High.

The project is being developed as a proactive traffic monitoring system, with support for location-based risk visualization and future smart transportation applications.

## Features

- Traffic risk prediction using Machine Learning
- Random Forest Classifier for risk classification
- Analysis of traffic, environmental, road, and driver-related parameters
- Data preprocessing and categorical encoding
- Model persistence using Joblib
- Prediction on new traffic data
- FastAPI backend for serving the ML model
- JWT-based user authentication
- User-specific prediction history
- Browser-based GPS location detection
- Interactive map using Leaflet and OpenStreetMap
- Frontend integration with the prediction API
- Display of predicted risk and confidence score

## Technologies Used

### Machine Learning

- Python
- Pandas
- Scikit-learn
- Joblib

### Backend

- FastAPI
- Python
- SQLAlchemy
- JWT Authentication
- SQLite

### Frontend

- React.js
- Vite
- JavaScript
- Leaflet
- OpenStreetMap

## Dataset Features

The model uses the following features for traffic risk prediction:

- `traffic_density`
- `horn_events_per_min`
- `avg_speed`
- `signal_wait_time`
- `weather_condition`
- `road_quality_score`
- `driver_experience_level`
- `stress_index`

## Machine Learning Pipeline

```text
Dataset Collection
        ↓
Data Preprocessing
        ↓
Feature Engineering
        ↓
Risk Label Generation
        ↓
Categorical Encoding
        ↓
Train-Test Split
        ↓
Random Forest Training
        ↓
Model Evaluation
        ↓
Model Persistence
        ↓
Risk Prediction

## Model Used
Random Forest Classifier

Random Forest was selected for the traffic risk classification task because it works well with structured tabular data and can handle multiple traffic and environmental features.

The trained model is saved using Joblib and loaded by the FastAPI backend during prediction.

## Current System

The current system supports:

User registration and login
JWT-based authentication
Protected prediction API
Machine Learning based risk prediction
Prediction confidence calculation
Storage of predictions associated with users
User-specific prediction history
Browser GPS location detection
Interactive map with the current location
React frontend connected to the FastAPI backend

The frontend can send traffic-related inputs to the backend and display the resulting risk level and confidence.

## Model Performance

The current trained Random Forest model achieved approximately 99% accuracy on the available evaluation dataset.

## Model evaluation includes:
Accuracy
Classification Report
Confusion Matrix

The saved model and encoders are used for making predictions on new input data.

## Project Structure
traffic-risk-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── db/
│   │   ├── ml/
│   │   └── services/
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md

## How to Run
### Backend

Navigate to the backend directory:

cd backend

Install the Python dependencies:

pip install -r requirements.txt

Start the FastAPI server:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000

Swagger API documentation is available at:

http://127.0.0.1:8000/docs

### Frontend

Open another terminal and navigate to the frontend directory:

cd frontend

Install the dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

## Future Enhancements
Real-time traffic data integration
Location-based traffic risk zones
Accident hotspot visualization
Risk-based route analysis
Alternate route recommendation
Real-time traffic dashboard
Video-based traffic behavior analysis
CNN and BiLSTM based traffic analysis
Integration with smart-city transportation systems

## Author
Monish V