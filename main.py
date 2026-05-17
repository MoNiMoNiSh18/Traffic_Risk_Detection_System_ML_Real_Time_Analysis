import joblib
import pandas as pd
df=pd.read_csv("data/dataset.csv")
print(df.head())

def calculate_risk(row):
    score = 0
    if row["traffic_density"] > 70:
        score += 2
    elif row["traffic_density"] > 40:
        score += 1
    if row["avg_speed"] > 80:
        score += 2
    elif row["avg_speed"] > 50:
        score += 1
    if row["stress_index"] > 75:
        score += 2
    elif row["stress_index"] > 40:
        score += 1
    if row["weather_condition"] in ["Foggy", "Rainy"]:
        score += 2
    if row["road_quality_score"] < 4:
        score += 2
    elif row["road_quality_score"] < 7:
        score += 1
    if score >= 6:
        return "High"
    elif score >= 4:
        return "Medium"
    else:
        return "Low"

df["risk_level"] = df.apply(calculate_risk, axis=1)
print(df[[
    "traffic_density",
    "avg_speed",
    "stress_index",
    "risk_level"
]].head())
print(df["risk_level"].value_counts())

from sklearn.preprocessing import LabelEncoder

le_weather = LabelEncoder()
le_driver = LabelEncoder()
le_risk = LabelEncoder()

df["weather_condition"] = le_weather.fit_transform(
    df["weather_condition"]
)
df["driver_experience_level"] = le_driver.fit_transform(
    df["driver_experience_level"]
)
df["risk_level"] = le_risk.fit_transform(
    df["risk_level"]
)
print(df.head())
X = df.drop("risk_level", axis=1)
y = df["risk_level"]
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
from sklearn.metrics import accuracy_score
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred))
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test, y_pred)
print(cm)

joblib.dump(model, "models/risk_prediction_model.pkl")
joblib.dump(le_weather, "models/weather_encoder.pkl")
joblib.dump(le_driver, "models/driver_encoder.pkl")
joblib.dump(le_risk, "models/risk_encoder.pkl")