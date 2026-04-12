from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="Malaria Diagnosis API")

# CORS (allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This onelater restrict to our frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model safely
model = None
scaler = None

def load_model():
    global model, scaler
    try:
        model = joblib.load(os.path.join(BASE_DIR, "models", "model.pkl"))
        scaler = joblib.load(os.path.join(BASE_DIR, "models", "scaler.pkl"))
        print("Model loaded successfully")
    except Exception as e:
        print("Error loading model:", e)

load_model()

# Input validation (better)
class PatientData(BaseModel):
    age: int = Field(..., ge=0, le=120)
    sex: int = Field(..., ge=0, le=1)
    fever: int = Field(..., ge=0, le=1)
    headache: int = Field(..., ge=0, le=1)
    abdominal_pain: int = Field(..., ge=0, le=1)
    malaise: int = Field(..., ge=0, le=1)
    dizziness: int = Field(..., ge=0, le=1)
    vomiting: int = Field(..., ge=0, le=1)
    confusion: int = Field(..., ge=0, le=1)
    backache: int = Field(..., ge=0, le=1)
    chest_pain: int = Field(..., ge=0, le=1)
    coughing: int = Field(..., ge=0, le=1)
    joint_pain: int = Field(..., ge=0, le=1)

#  Health check endpoint
@app.get("/")
def home():
    return {"status": "API running "}

# Prediction endpoint
@app.post("/predict")
def predict(data: PatientData):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Convert input to list
        features = list(data.dict().values())

        # Feature engineering (same as training)
        symptom_count = sum(features[2:])
        fever_headache = data.fever * data.headache
        fever_vomiting = data.fever * data.vomiting

        age_group = (
            0 if data.age <= 5 else
            2 if data.age <= 18 else
            1 if data.age <= 50 else
            3
        )

        # Final vector
        vec = np.array([
            features + [symptom_count, fever_headache, fever_vomiting, age_group]
        ])

        # Scale + predict
        scaled = scaler.transform(vec)
        pred = int(model.predict(scaled)[0])
        proba = model.predict_proba(scaled)[0]

        return {
            "prediction": pred,
            "confidence": float(max(proba)),
            "probabilities": {
                "negative": float(proba[0]),
                "positive": float(proba[1])
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))