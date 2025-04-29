import os
import joblib
import numpy as np
import pandas as pd
import shap
from lime.lime_tabular import LimeTabularExplainer
from django.conf import settings

BASE_DIR = settings.BASE_DIR
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "diabetes_rf_recall.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml", "models", "robust_scaler.pkl")
RAW_CSV = os.path.join(BASE_DIR, "ml", "data", "diabetes_dataset.csv")

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
_shap_explainer = shap.TreeExplainer(_model)

_df_raw = pd.read_csv(RAW_CSV)
_df_encoded = pd.get_dummies(_df_raw, columns=['gender', 'smoking_history'], drop_first=True)
for col in FEATURE_ORDER:
    if col not in _df_encoded.columns:
        _df_encoded[col] = 0
_X_bg = _df_encoded[FEATURE_ORDER].values
df_bg = pd.DataFrame(_X_bg, columns=FEATURE_ORDER)
_X_bg_scaled = _scaler.transform(df_bg)
_lime_explainer = LimeTabularExplainer(
    _X_bg_scaled,
    feature_names=FEATURE_ORDER,
    class_names=['no_diabetes', 'diabetes'],
    discretize_continuous=True
)

def _build_features(input_data: dict) -> np.ndarray:
    """
    Build and return a scaled feature array for the model given raw input_data.
    """
    features = {name: 0 for name in FEATURE_ORDER}

    features['age'] = input_data['age']
    features['hypertension'] = int(input_data['hypertension'])
    features['heart_disease'] = int(input_data['heart_disease'])
    features['bmi'] = input_data['bmi']
    features['HbA1c_level'] = input_data['HbA1c_level']
    features['blood_glucose_level'] = input_data['blood_glucose_level']

    gender = input_data.get('gender')
    if gender == 'Male':
        features['gender_Male'] = 1
    elif gender == 'Other':
        features['gender_Other'] = 1

    sh = input_data.get('smoking_history')
    col = f"smoking_history_{sh}"
    if col in features:
        features[col] = 1

    arr = np.array([features[name] for name in FEATURE_ORDER]).reshape(1, -1)
    return _scaler.transform(pd.DataFrame(arr, columns=FEATURE_ORDER))

def predict_risk(input_data: dict) -> dict:
    """
    Given a dict of feature values, scale and predict.
    Returns {"label": int, "probability": float}.
    """
    X_scaled = _build_features(input_data)
    proba = _model.predict_proba(X_scaled)[0, 1]
    label = int(proba >= 0.5)
    return {"label": label, "probability": float(proba)}

def get_shap_values(input_data: dict) -> dict:
    """
    Return SHAP values dict for class 1 (diabetes) given raw input_data.
    """
    X_scaled = _build_features(input_data)
    raw_shap = _shap_explainer.shap_values(X_scaled)
    if isinstance(raw_shap, list):
        shap_array = raw_shap[1]
    else:
        shap_array = raw_shap
    shap_vals = shap_array[0]
    return dict(zip(FEATURE_ORDER, shap_vals.tolist()))

def get_lime_summary(input_data: dict, num_features: int = 5) -> list[dict]:
    """
    Returns a list of the top `num_features` local explanations from LIME:      
    [ {"feature": name, "impact": weight}, … ]
    """
    X_scaled = _build_features(input_data)

    explanation = _lime_explainer.explain_instance(
        X_scaled[0],
        _model.predict_proba,
        num_features=num_features
    )

    summary = []
    for feature, weight in explanation.as_list(label=1):
        summary.append({
            "feature": feature,
            "impact": float(weight)
        })
    return summary