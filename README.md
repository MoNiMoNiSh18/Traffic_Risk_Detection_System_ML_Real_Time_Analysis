Traffic Risk Detection System:Machine Learning And Real Time Based

Overview

This project is an AI-powered Traffic Risk Detection System developed using Machine Learning techniques. The system analyzes traffic and environmental conditions to predict traffic risk levels as Low, Medium, or High.

The project aims to support proactive traffic monitoring and future smart-city transportation systems.

Features
Traffic risk prediction using Machine Learning
Random Forest Classifier implementation
Risk analysis based on traffic and environmental parameters
Data preprocessing and feature engineering
Model persistence using Joblib
Prediction on new unseen traffic data

Technologies Used

Machine Learning
Python
Pandas
Scikit-learn
Joblib

Backend 
Spring Boot
FastAPI

Frontend 
React.js
HTML
CSS
JavaScript
Dataset Features

The dataset includes:

traffic_density
horn_events_per_min
avg_speed
signal_wait_time
weather_condition
road_quality_score
driver_experience_level
stress_index

Machine Learning Pipeline

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
Prediction
        ↓
Performance Evaluation

Model Used
Random Forest Classifier

Random Forest was used because:

High classification accuracy
Handles structured tabular data efficiently
Reduces overfitting using ensemble learning
Computationally efficient
Suitable for real-time prediction systems

Current Output
Risk Prediction Accuracy: ~99%
Classification Report
Confusion Matrix
Saved ML Model

Future Enhancements
Real-time traffic API integration
GPS-based route risk analysis
Accident hotspot visualization
Alternate route recommendation
CNN + BiLSTM integration for video-based traffic analysis
Smart city traffic dashboard

How to Run
Install dependencies
pip install -r requirements.txt
Train model
py main.py
Predict risk
py predict.py

Author
Monish V