import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "extreme_rainfall_model.pkl"
METADATA_PATH = BASE_DIR / "model_metadata.json"

model = joblib.load(MODEL_PATH)

with open(METADATA_PATH, "r", encoding="utf-8") as f:
    metadata = json.load(f)

FEATURES = metadata["features"]
THRESHOLD = float(metadata["threshold"])


def predict_extreme_rainfall(weather_features):
    """
    Predict next-day extreme-rainfall risk.

    Parameters:
        weather_features (dict): All required model features.

    Returns:
        dict: Probability, threshold, prediction, and risk label.
    """
    if not isinstance(weather_features, dict):
        raise TypeError("weather_features must be a dictionary.")

    missing = [
        feature for feature in FEATURES
        if feature not in weather_features
    ]

    if missing:
        raise ValueError(f"Missing required features: {missing}")

    row = pd.DataFrame(
        [[weather_features[feature] for feature in FEATURES]],
        columns=FEATURES
    )

    row = row.apply(pd.to_numeric, errors="coerce")
    row = row.replace([np.inf, -np.inf], np.nan)

    if row.isna().all(axis=1).iloc[0]:
        raise ValueError("All input features are missing or invalid.")

    probability = float(model.predict_proba(row)[0, 1])
    prediction = int(probability >= THRESHOLD)

    return {
        "predicted_probability": round(probability, 4),
        "threshold": THRESHOLD,
        "prediction": prediction,
        "risk_label": (
            "Elevated extreme-rainfall risk"
            if prediction == 1
            else "Below model alert threshold"
        ),
        "target": "Next-day extreme rainfall"
    }
