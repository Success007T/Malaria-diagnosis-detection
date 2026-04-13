import streamlit as st
import numpy as np
import pandas as pd
import joblib
import urllib.parse

# ─────────────────────────────────────────────
# Page config
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Malaria Dx",
    page_icon="🩺",
    layout="centered",
)

# ─────────────────────────────────────────────
# Custom CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
    --bg:          #0b0f14;
    --surface:     #111720;
    --surface-2:   #181f2a;
    --border:      rgba(255,255,255,0.07);
    --border-mid:  rgba(255,255,255,0.12);
    --text:        #dce6f0;
    --text-muted:  rgba(220,230,240,0.45);
    --text-dim:    rgba(220,230,240,0.65);
    --accent:      #3ecfcf;
    --accent-2:    #1a9a9a;
    --danger:      #f05c5c;
    --danger-dim:  rgba(240,92,92,0.15);
    --success:     #3ecf8e;
    --success-dim: rgba(62,207,142,0.12);
    --warn:        #f0a33e;
}

html, body, [class*="css"] {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--bg) !important;
    color: var(--text) !important;
}

/* ── hide default Streamlit chrome ── */
#MainMenu, footer, header { visibility: hidden; }
.block-container {
    padding-top: 2rem !important;
    padding-bottom: 3rem !important;
    max-width: 760px !important;
}

/* ── top wordmark bar ── */
.wordmark {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 2.5rem;
}
.wordmark-icon {
    width: 34px;
    height: 34px;
    background: var(--accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    flex-shrink: 0;
}
.wordmark-text {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
}
.wordmark-badge {
    margin-left: auto;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--accent);
    background: rgba(62,207,207,0.1);
    border: 1px solid rgba(62,207,207,0.2);
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
}

/* ── page title ── */
.page-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.8px;
    line-height: 1.15;
    margin-bottom: 0.4rem;
}
.page-subtitle {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 2rem;
    font-weight: 300;
}

/* ── section cards ── */
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 1rem;
}
.card-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
}
.card-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
}

/* ── Streamlit widget overrides ── */
[data-testid="stSelectbox"] label,
[data-testid="stNumberInput"] label,
[data-testid="stTextInput"] label,
[data-testid="stCheckbox"] label {
    color: var(--text-dim) !important;
    font-size: 0.82rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.01em !important;
}

div[data-baseweb="select"] > div,
div[data-baseweb="input"] > div,
input[type="number"],
input[type="text"] {
    background-color: var(--surface-2) !important;
    border-color: var(--border-mid) !important;
    border-radius: 8px !important;
    color: var(--text) !important;
}
div[data-baseweb="select"] > div:hover,
div[data-baseweb="input"] > div:hover {
    border-color: var(--accent) !important;
}

/* ── symptom checkboxes as pill grid ── */
.symptom-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-top: 0.5rem;
}
/* We can't style individual checkboxes per-item in pure Streamlit CSS,
   but we can style the checkbox container globally */
div[data-testid="stCheckbox"] {
    background: var(--surface-2) !important;
    border: 1px solid var(--border-mid) !important;
    border-radius: 8px !important;
    padding: 0.55rem 0.85rem !important;
    transition: border-color 0.15s, background 0.15s;
}
div[data-testid="stCheckbox"]:has(input:checked) {
    border-color: var(--accent) !important;
    background: rgba(62,207,207,0.08) !important;
}
div[data-testid="stCheckbox"] label {
    color: var(--text) !important;
    font-size: 0.84rem !important;
    font-weight: 400 !important;
}

/* ── run button ── */
.stButton > button {
    background: var(--accent) !important;
    color: #0b0f14 !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.75rem 2.5rem !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    width: 100% !important;
    margin-top: 1.25rem !important;
    transition: opacity 0.15s, transform 0.1s !important;
}
.stButton > button:hover {
    opacity: 0.88 !important;
    transform: translateY(-1px) !important;
}
.stButton > button:active {
    transform: translateY(0px) !important;
}

/* ── divider ── */
.divider {
    height: 1px;
    background: var(--border);
    margin: 1.5rem 0;
}

/* ── result cards ── */
.result-wrap {
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    margin-top: 1.75rem;
    position: relative;
    overflow: hidden;
}
.result-positive {
    background: var(--danger-dim);
    border: 1px solid rgba(240,92,92,0.3);
    border-left: 3px solid var(--danger);
}
.result-negative {
    background: var(--success-dim);
    border: 1px solid rgba(62,207,142,0.25);
    border-left: 3px solid var(--success);
}
.result-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
}
.result-label-pos { color: var(--danger); }
.result-label-neg { color: var(--success); }
.result-heading {
    font-family: 'Syne', sans-serif;
    font-size: 1.55rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 0.3rem;
}
.result-heading-pos { color: #f07575; }
.result-heading-neg { color: #5de0a5; }
.result-note {
    font-size: 0.82rem;
    color: var(--text-dim);
    font-weight: 300;
    margin-bottom: 1rem;
}

/* ── confidence bar ── */
.conf-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.25rem;
}
.conf-pct {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    min-width: 52px;
}
.conf-pct-pos { color: var(--danger); }
.conf-pct-neg { color: var(--success); }
.conf-track {
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 99px;
    overflow: hidden;
}
.conf-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(.4,0,.2,1);
}
.conf-fill-pos { background: var(--danger); }
.conf-fill-neg { background: var(--success); }
.conf-label {
    font-size: 0.72rem;
    color: var(--text-muted);
    min-width: 72px;
    text-align: right;
}

/* ── stat strip ── */
.stat-strip {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
}
.stat-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1rem;
}
.stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text);
}
.stat-desc {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
}

/* ── alert banner ── */
.alert-banner {
    background: rgba(240,92,92,0.09);
    border: 1px solid rgba(240,92,92,0.25);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.83rem;
    color: var(--text);
    margin: 1.25rem 0 0.75rem 0;
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
}

/* ── map ── */
.map-shell {
    border: 1px solid rgba(240,92,92,0.2);
    border-radius: 10px;
    overflow: hidden;
}
.map-cta-btn {
    display: block;
    text-align: center;
    margin-top: 0.75rem;
    background: var(--danger);
    color: #fff !important;
    text-decoration: none !important;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: opacity 0.15s;
}
.map-cta-btn:hover { opacity: 0.85; }

/* ── section label (for prob chart) ── */
.section-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 1.5rem 0 0.6rem 0;
}

/* ── footer ── */
.footer {
    font-size: 0.72rem;
    color: var(--text-muted);
    text-align: center;
    margin-top: 2.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
    line-height: 1.6;
}

/* ── step indicator ── */
.steps {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
}
.step {
    flex: 1;
    padding: 0.6rem 0.5rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--surface);
    letter-spacing: 0.03em;
    border-right: 1px solid var(--border);
}
.step:last-child { border-right: none; }
.step-num {
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 0.1rem;
}
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Wordmark
# ─────────────────────────────────────────────
st.markdown("""
<div class="wordmark">
    <div class="wordmark-icon">🩺</div>
    <div class="wordmark-text">MalariaDx</div>
    <div class="wordmark-badge">XGBoost · AUC 0.9984</div>
</div>

<div class="page-title">Symptom-Based<br>Diagnosis</div>
<div class="page-subtitle">Fill in patient details below — results are generated instantly. For clinical support use only.</div>

<div class="steps">
    <div class="step"><span class="step-num">01</span>Demographics</div>
    <div class="step"><span class="step-num">02</span>Symptoms</div>
    <div class="step"><span class="step-num">03</span>Results</div>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Model loader
# ─────────────────────────────────────────────
@st.cache_resource
def load_model():
    try:
        model  = joblib.load("backend/models/model.pkl")
        scaler = joblib.load("backend/models/scaler.pkl")
        return model, scaler
    except FileNotFoundError:
        return None, None

model, scaler = load_model()

if model is None:
    st.warning("⚠️  Model files not found. Place `model.pkl` and `scaler.pkl` inside a `models/` folder, then restart.")

# ─────────────────────────────────────────────
# Card 1 — Demographics
# ─────────────────────────────────────────────
st.markdown('<div class="card"><div class="card-title">01 &nbsp; Patient Demographics</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns([2, 2, 3])
with col1:
    age = st.number_input("Age (years)", min_value=0, max_value=120, value=30, label_visibility="visible")
with col2:
    sex = st.selectbox("Biological Sex", ["Female", "Male"])
with col3:
    location_input = st.text_input(
        "City / Address",
        placeholder="e.g. Abuja, Nigeria",
        help="Used to locate nearby hospitals if result is positive",
    )

st.markdown("</div>", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Card 2 — Symptoms
# ─────────────────────────────────────────────
SYMPTOMS = [
    ("Fever",                "🌡️"),
    ("Headache",             "🤕"),
    ("Abdominal Pain",       "😣"),
    ("General Body Malaise", "😴"),
    ("Dizziness",            "💫"),
    ("Vomiting",             "🤢"),
    ("Confusion",            "😵"),
    ("Backache",             "🦴"),
    ("Chest Pain",           "💔"),
    ("Coughing",             "😮‍💨"),
    ("Joint Pain",           "🦵"),
]

symptom_keys = [s[0].replace(" ", "_") for s in SYMPTOMS]

st.markdown("""
<div class="card">
    <div class="card-title">02 &nbsp; Presenting Symptoms</div>
    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;margin-top:-0.4rem;">
        Select all symptoms currently observed in the patient.
    </p>
""", unsafe_allow_html=True)

symptoms = {}
cols = st.columns(3)
for i, (name, emoji) in enumerate(SYMPTOMS):
    key = name.replace(" ", "_")
    with cols[i % 3]:
        symptoms[key] = int(st.checkbox(f"{emoji}  {name}", key=f"sym_{key}"))

symptom_count = sum(symptoms.values())

# Live symptom count indicator
if symptom_count == 0:
    count_color = "var(--text-muted)"
    count_note  = "No symptoms selected"
elif symptom_count <= 2:
    count_color = "var(--warn)"
    count_note  = f"{symptom_count} symptom{'s' if symptom_count > 1 else ''} selected"
else:
    count_color = "var(--danger)"
    count_note  = f"{symptom_count} symptoms selected — high symptom load"

st.markdown(f"""
    <div style="margin-top:1rem;padding:0.6rem 0.9rem;background:rgba(255,255,255,0.03);
                border-radius:7px;border:1px solid var(--border);font-size:0.8rem;
                color:{count_color};font-weight:500;">
        ● &nbsp; {count_note}
    </div>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Derived features
# ─────────────────────────────────────────────
def get_age_group(a):
    if a <= 5:    return 0
    elif a <= 18: return 2
    elif a <= 50: return 1
    else:         return 3

sex_encoded    = 0 if sex == "Female" else 1
fever_headache = symptoms["Fever"] * symptoms["Headache"]
fever_vomiting = symptoms["Fever"] * symptoms["Vomiting"]
age_group      = get_age_group(age)

feature_vector = np.array([[
    age, sex_encoded,
    symptoms["Fever"], symptoms["Headache"], symptoms["Abdominal_Pain"],
    symptoms["General_Body_Malaise"], symptoms["Dizziness"], symptoms["Vomiting"],
    symptoms["Confusion"], symptoms["Backache"], symptoms["Chest_Pain"],
    symptoms["Coughing"], symptoms["Joint_Pain"],
    symptom_count, fever_headache, fever_vomiting, age_group,
]])

# ─────────────────────────────────────────────
# Run Diagnosis button
# ─────────────────────────────────────────────
run = st.button("▶  Run Diagnosis")

if run:
    if model is None or scaler is None:
        st.error("Cannot run — model files are missing.")
    else:
        X_scaled    = scaler.transform(feature_vector)
        prediction  = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0]
        pos_prob    = probability[1]
        neg_prob    = probability[0]

        # ── Result card ──────────────────────────────────────────────
        if prediction == 1:
            action_text = "Recommend immediate clinical review and treatment protocol."
            st.markdown(f"""
            <div class="result-wrap result-positive">
                <div class="result-label result-label-pos">Diagnosis Result</div>
                <div class="result-heading result-heading-pos">Malaria Positive</div>
                <div class="result-note">{action_text}</div>
                <div class="conf-row">
                    <div class="conf-pct conf-pct-pos">{pos_prob*100:.1f}%</div>
                    <div class="conf-track">
                        <div class="conf-fill conf-fill-pos" style="width:{pos_prob*100:.1f}%"></div>
                    </div>
                    <div class="conf-label">Confidence</div>
                </div>
                <div class="stat-strip">
                    <div class="stat-box">
                        <div class="stat-value">{symptom_count}</div>
                        <div class="stat-desc">Symptoms reported</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{'Pediatric' if age <= 18 else 'Adult'}</div>
                        <div class="stat-desc">Age group</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            action_text = "No malaria detected from presented symptoms. Monitor patient if symptoms persist."
            st.markdown(f"""
            <div class="result-wrap result-negative">
                <div class="result-label result-label-neg">Diagnosis Result</div>
                <div class="result-heading result-heading-neg">Malaria Negative</div>
                <div class="result-note">{action_text}</div>
                <div class="conf-row">
                    <div class="conf-pct conf-pct-neg">{neg_prob*100:.1f}%</div>
                    <div class="conf-track">
                        <div class="conf-fill conf-fill-neg" style="width:{neg_prob*100:.1f}%"></div>
                    </div>
                    <div class="conf-label">Confidence</div>
                </div>
                <div class="stat-strip">
                    <div class="stat-box">
                        <div class="stat-value">{symptom_count}</div>
                        <div class="stat-desc">Symptoms reported</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{'Pediatric' if age <= 18 else 'Adult'}</div>
                        <div class="stat-desc">Age group</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        # ── Probability breakdown ────────────────────────────────────
        st.markdown('<div class="section-label">Probability Breakdown</div>', unsafe_allow_html=True)
        prob_df = pd.DataFrame({
            "Outcome":     ["Negative", "Positive"],
            "Probability": [neg_prob, pos_prob],
        })
        st.bar_chart(prob_df.set_index("Outcome"), color=["#3ecfcf"])

        # ── Nearest hospitals (positive only) ───────────────────────
        if prediction == 1:
            st.markdown("""
            <div class="alert-banner">
                <span style="font-size:1.1rem;flex-shrink:0;">🚨</span>
                <div>
                    <strong>Urgent action required.</strong> Please refer this patient to the nearest 
                    hospital immediately for laboratory confirmation and treatment.
                </div>
            </div>
            <div class="section-label">Nearest Hospitals</div>
            """, unsafe_allow_html=True)

            loc = location_input.strip()
            if not loc:
                st.info("💡 Enter a city or address in the **City / Address** field above and re-run to see nearby hospitals on the map.")
            else:
                search_query = urllib.parse.quote(f"hospitals near {loc}")
                embed_url    = f"https://www.google.com/maps?q={search_query}&output=embed"
                maps_url     = f"https://www.google.com/maps/search/{search_query}"

                st.markdown(
                    f'<div class="map-shell">'
                    f'<iframe src="{embed_url}" width="100%" height="420" '
                    f'style="border:0;display:block;" allowfullscreen loading="lazy" '
                    f'referrerpolicy="no-referrer-when-downgrade"></iframe>'
                    f'</div>',
                    unsafe_allow_html=True,
                )
                st.markdown(
                    f'<a class="map-cta-btn" href="{maps_url}" target="_blank">'
                    f'🗺 Open Full Map & Get Directions →'
                    f'</a>',
                    unsafe_allow_html=True,
                )

# ─────────────────────────────────────────────
# Footer
# ─────────────────────────────────────────────
st.markdown("""
<div class="footer">
    For clinical decision support only &mdash; does not replace professional medical judgement.<br>
    Always confirm with laboratory testing. Map data &copy; Google Maps.
</div>
""", unsafe_allow_html=True)