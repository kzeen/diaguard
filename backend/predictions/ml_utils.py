import joblib
import numpy as np
from django.conf import settings
import os

BASE_DIR    = settings.BASE_DIR
MODEL_PATH  = os.path.join(BASE_DIR, "ml", "models", "diabetes_rf_recall.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml", "models", "robust_scaler.pkl")

FEATURE_ORDER = [
    'age',
    'hypertension',
    'heart_disease',
    'bmi',
    'HbA1c_level',
    'blood_glucose_level',
    'gender_Male',
    'gender_Other',
    'smoking_history_current',
    'smoking_history_ever',
    'smoking_history_former',
    'smoking_history_never',
    'smoking_history_not current'
]


_model  = joblib.load(MODEL_PATH)
_scaler = joblib.load(SCALER_PATH)

def predict_risk(input_data: dict) -> dict:
    """
    Given a dict of feature values, scale and predict.
    Returns {"label": int, "probability": float}.
    """
    features = { name: 0 for name in FEATURE_ORDER }

    features['age'] = input_data['age']
    features['hypertension'] = int(input_data['hypertension'])
    features['heart_disease'] = int(input_data['heart_disease'])
    features['bmi'] = input_data['bmi']
    features['HbA1c_level'] = input_data['HbA1c_level']
    features['blood_glucose_level'] = input_data['blood_glucose_level']

    gender = input_data['gender']
    if gender == 'Male':
        features['gender_Male'] = 1
    elif gender == 'Other':
        features['gender_Other'] = 1

    smoking_history = input_data['smoking_history']
    col_name = f"smoking_history_{smoking_history}"
    if col_name in features:
        features[col_name] = 1

    arr = np.array([features[name] for name in FEATURE_ORDER]).reshape(1, -1)

    X_scaled = _scaler.transform(arr)
    proba    = _model.predict_proba(X_scaled)[0, 1]
    label    = int(proba >= 0.5)
    return {"label": label, "probability": float(proba)}