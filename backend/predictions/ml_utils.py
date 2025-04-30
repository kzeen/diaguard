import os
import joblib
import numpy as np
import pandas as pd
import shap
from lime.lime_tabular import LimeTabularExplainer
from django.conf import settings
import functools
import warnings

np.seterr(divide='ignore', over='ignore', invalid='ignore')
warnings.filterwarnings("ignore", category=RuntimeWarning, module="sklearn")

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

@functools.lru_cache(maxsize=256)
def _build_features_tuple(
    gender:str, age:float, hypertension: bool, heart_disease: bool,
    bmi:float, HbA1c_level: float, blood_glucose_level: float,
    smoking_history: str
) -> tuple:
    """
    Build an immutable tuple of raw feature values in FEATURE_ORDER.
    LRU-cached to avoid repeating this dict/array assembly
    """
    features = {name: 0 for name in FEATURE_ORDER}

    features['age'] = age
    features['hypertension'] = int(hypertension)
    features['heart_disease'] = int(heart_disease)
    features['bmi'] = bmi
    features['HbA1c_level'] = HbA1c_level
    features['blood_glucose_level'] = blood_glucose_level

    if gender == 'Male':
        features['gender_Male'] = 1
    elif gender == 'Other':
        features['gender_Other'] = 1

    col = f"smoking_history_{smoking_history}"
    if col in features:
        features[col] = 1

    return tuple(features[name] for name in FEATURE_ORDER)

def _build_features(input_data: dict) -> np.ndarray:
    """
    Scale and return the feature array for a single input_data dict
    """
    tup = _build_features_tuple(
        input_data.get('gender'),
        input_data['age'],
        input_data['hypertension'],
        input_data['heart_disease'],
        input_data['bmi'],
        input_data['HbA1c_level'],
        input_data['blood_glucose_level'],
        input_data.get('smoking_history')
    )

    return _scaler.transform(pd.DataFrame([list(tup)], columns=FEATURE_ORDER))

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
    shap_array = np.asarray(shap_array).flatten()

    shap_dict = {}
    for idx, feat in enumerate(FEATURE_ORDER):
        try:
            value = shap_array[idx]
        except IndexError:
            value = 0.0
        shap_dict[feat] = float(value)

    return shap_dict

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