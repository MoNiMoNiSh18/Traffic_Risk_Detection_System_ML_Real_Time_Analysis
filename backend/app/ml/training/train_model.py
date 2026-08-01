import joblib
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import label_binarize
from sklearn.metrics import roc_curve, auc
import numpy as np

df=pd.read_csv("ml/data/dataset.csv")
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
class_names = le_risk.classes_
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
print("Classification Report:")
report = classification_report(
    y_test,
    y_pred,
    target_names=class_names,
    output_dict=True
)

print(classification_report(
    y_test,
    y_pred,
    target_names=class_names
))
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Generate confusion matrix
cm = confusion_matrix(y_test, y_pred)

print("Confusion Matrix:")
print(cm)

# Display class labels
class_names = le_risk.classes_

# Create figure
fig, ax = plt.subplots(figsize=(6, 5))

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=class_names
)

disp.plot(
    cmap="grey",
    values_format="d",
    ax=ax,
    colorbar=False
)

plt.title("Confusion Matrix of Random Forest Classifier", fontsize=14)
plt.xlabel("Predicted Class", fontsize=12)
plt.ylabel("Actual Class", fontsize=12)

plt.tight_layout()

# Save high-quality image
plt.savefig(
    "confusion_matrix.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ---------------- Feature Importance ----------------

feature_names = X.columns
importances = model.feature_importances_

indices = np.argsort(importances)

plt.figure(figsize=(8,5))

plt.barh(range(len(indices)),
         importances[indices],
         align="center")

plt.yticks(range(len(indices)),
           feature_names[indices])

plt.xlabel("Feature Importance")
plt.title("Feature Importance using Random Forest")

plt.tight_layout()

plt.savefig(
    "feature_importance.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()
# ------------ Classification Report Bar Chart ------------

metrics = ["precision", "recall", "f1-score"]

classes = class_names

precision = [report[c]["precision"] for c in classes]
recall = [report[c]["recall"] for c in classes]
f1 = [report[c]["f1-score"] for c in classes]

x = np.arange(len(classes))
width = 0.25

plt.figure(figsize=(8,5))

plt.bar(x-width, precision, width, label="Precision")
plt.bar(x, recall, width, label="Recall")
plt.bar(x+width, f1, width, label="F1-score")

plt.xticks(x, classes)

plt.ylim(0.95,1.02)

plt.ylabel("Score")

plt.title("Classification Performance")

plt.legend()

plt.tight_layout()

plt.savefig(
    "classification_report.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ---------------- Correlation Heatmap ----------------

corr = df.corr(numeric_only=True)

plt.figure(figsize=(10,8))

im = plt.imshow(corr, cmap="coolwarm", interpolation="nearest")

plt.colorbar(im)

plt.xticks(
    range(len(corr.columns)),
    corr.columns,
    rotation=45,
    ha="right"
)

plt.yticks(
    range(len(corr.columns)),
    corr.columns
)

plt.title("Correlation Heatmap of Traffic Dataset")

plt.tight_layout()

plt.savefig(
    "correlation_heatmap.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()
# -------------------- ROC Curve --------------------

# Convert labels to binary format
classes = np.unique(y_test)
y_test_bin = label_binarize(y_test, classes=classes)

# Probability predictions
y_score = model.predict_proba(X_test)

# Compute ROC curve and AUC for each class
fpr = {}
tpr = {}
roc_auc = {}

for i in range(len(classes)):
    fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], y_score[:, i])
    roc_auc[i] = auc(fpr[i], tpr[i])

# Plot ROC curves
plt.figure(figsize=(7,6))

colors = ["blue", "green", "red"]

for i, color in zip(range(len(classes)), colors):
    plt.plot(
        fpr[i],
        tpr[i],
        color=color,
        lw=2,
        label=f"{class_names[i]} (AUC = {roc_auc[i]:.3f})"
    )

# Reference line
plt.plot([0,1],[0,1],'k--',lw=1)

plt.xlim([0.0,1.0])
plt.ylim([0.0,1.05])

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve of Random Forest Classifier")
plt.legend(loc="lower right")

plt.grid(True)

plt.tight_layout()

plt.savefig(
    "roc_curve.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

joblib.dump(model, "ml/models/risk_prediction_model.pkl")
joblib.dump(le_weather, "ml/models/weather_encoder.pkl")
joblib.dump(le_driver, "ml/models/driver_encoder.pkl")
joblib.dump(le_risk, "ml/models/risk_encoder.pkl")