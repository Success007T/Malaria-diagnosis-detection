# 🩺 MalariaDx — Symptom-Based Malaria Diagnosis & Detection

> A machine-learning-powered clinical decision support tool that predicts malaria diagnosis from patient symptoms in real time. Built as a hackathon entry and deployed as a full-stack web application.

**Live Demo:** [malaria-diagnosis-detection.vercel.app](https://malaria-diagnosis-detection.vercel.app)

---

## 📌 Overview

MalariaDx is an end-to-end malaria diagnosis system that takes patient demographics and presenting symptoms as input and outputs a malaria positive/negative prediction with a confidence score. For positive cases, the app surfaces the nearest hospitals on an embedded Google Maps interface to support immediate referral.

The model achieves an **AUC-ROC of 0.9984** using an XGBoost classifier trained on a labelled symptom dataset.

> ⚠️ **Disclaimer:** This tool is for clinical decision support only and does not replace professional medical judgement. Always confirm results with laboratory testing.

---

## ✨ Features

- **Instant Symptom-Based Prediction** — select from 11 common malaria symptoms and get a real-time diagnosis
- **Confidence Scoring** — probability breakdown (positive vs. negative) displayed as a visual bar chart
- **Demographic-Aware** — factors in patient age group, biological sex, and derived symptom interaction features
- **Hospital Locator** — positive cases trigger an embedded Google Maps view of nearby hospitals based on the patient's entered location
- **Clean Clinical UI** — dark-mode Streamlit interface with a custom design system (Syne + DM Sans, CSS variables)
- **Deployed Full-Stack** — Streamlit app + FastAPI backend, frontend deployed on Vercel

---

## 🧠 Model Details

| Attribute | Value |
|---|---|
| Algorithm | XGBoost Classifier |
| AUC-ROC | 0.9984 |
| Preprocessing | StandardScaler |
| Input Features | 17 (demographics + symptoms + engineered) |

### Input Features

**Demographics:** Age, Biological Sex (encoded)

**Symptoms (binary flags):** Fever, Headache, Abdominal Pain, General Body Malaise, Dizziness, Vomiting, Confusion, Backache, Chest Pain, Coughing, Joint Pain

**Engineered Features:** Total symptom count, Fever × Headache interaction, Fever × Vomiting interaction, Age group (0–3 categorical)

---

## 🗂️ Project Structure

```
Malaria-diagnosis-detection/
├── app.py                          # Streamlit application (main entry point)
├── requirements.txt                # Python dependencies
├── .env                            # Environment variables
├── analysis.ipynb                  # Exploratory data analysis notebook
├── predictive modelling.ipynb      # Initial modelling notebook
├── predictive_modelling_fixed.ipynb # Corrected & final modelling notebook
├── backend/
│   └── models/
│       ├── model.pkl               # Trained XGBoost model
│       └── scaler.pkl              # Fitted StandardScaler
├── datasets/                       # Raw and processed data
├── frontend/                       # TypeScript frontend (Vercel deployment)
├── reports and documentations/     # Project reports and writeups
├── package.json                    # Node/frontend dependencies
└── node_modules/
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js (for the frontend, if running locally)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Success007T/Malaria-diagnosis-detection.git
cd Malaria-diagnosis-detection
```

2. **Install Python dependencies**

```bash
pip install -r requirements.txt
```

3. **Ensure model files are in place**

The app expects the trained model and scaler at:
```
backend/models/model.pkl
backend/models/scaler.pkl
```

If you need to retrain the model, run through `predictive_modelling_fixed.ipynb` and save the artefacts to that path.

4. **Run the Streamlit app**

```bash
streamlit run app.py
```

The app will open at `http://localhost:8501`.

---

## 🖥️ How to Use

1. **Demographics** — enter the patient's age, biological sex, and city/address
2. **Symptoms** — check all currently presenting symptoms from the grid of 11 options
3. **Run Diagnosis** — click the button to generate a prediction
4. **Review Results** — view the positive/negative outcome, confidence percentage, and probability chart
5. **Hospital Referral** (positive cases only) — an embedded map and direct link to nearby hospitals will appear based on the entered location

---

## 🔬 Notebooks

| Notebook | Purpose |
|---|---|
| `analysis.ipynb` | Exploratory data analysis — distributions, correlations, symptom prevalence |
| `predictive modelling.ipynb` | Initial model training and evaluation |
| `predictive_modelling_fixed.ipynb` | Final corrected pipeline — used to generate production model artefacts |

---

## 📦 Key Dependencies

| Package | Role |
|---|---|
| `xgboost` | Classification model |
| `scikit-learn` | Preprocessing & evaluation |
| `streamlit` | Web application UI |
| `fastapi` | Backend API |
| `pandas` / `numpy` | Data manipulation |
| `joblib` | Model serialisation |
| `folium` / `streamlit-folium` | Map rendering |
| `geopy` | Geocoding support |

See `requirements.txt` for the full pinned dependency list.

---

## 📊 Results

The XGBoost model demonstrates strong diagnostic performance on the test set:

- **AUC-ROC: 0.9984** — near-perfect class separation
- Confidence scores are surfaced directly in the UI alongside predictions
- Probability breakdown chart included for both positive and negative outcomes

---

## 🌍 Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com) — [malaria-diagnosis-detection.vercel.app](https://malaria-diagnosis-detection.vercel.app)
- **Backend:** FastAPI server (`backend/`)
- **Streamlit App:** Can be run locally or deployed to Streamlit Community Cloud

---

## 🤝 Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss what you'd like to change.

---

## 👤 Author

**Success Umazayi**
[GitHub](https://github.com/Success007T) · [Portfolio](https://successumazayi.netlify.app)  

**Emmanuel Nneji**
[GitHub](https://github.com/nuelrl)

---

## 📄 License

This project is open source. See the repository for licence details.
