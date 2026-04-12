import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { predictMalaria } from "./api";
import type { PatientData } from "./types";
import Footer from "./components/footer";
import ConfidenceRing from "./components/confidenceRing";
import ProbBar from "./components/ProbBar";
import StepDots from "./components/StepDots";
import Card from "./components/card";
import SectionLabel from "./components/SectionLabel";
import Page1 from "./components/pages/page-1";
// ── Symptom metadata ──────────────────────────────────────────────────────────
const SYMPTOMS: { key: keyof PatientData; label: string }[] = [
  { key: "fever", label: "Fever" },
  { key: "headache", label: "Headache" },
  { key: "abdominal_pain", label: "Abdominal Pain" },
  { key: "malaise", label: "Body Malaise" },
  { key: "dizziness", label: "Dizziness" },
  { key: "vomiting", label: "Vomiting" },
  { key: "confusion", label: "Confusion" },
  { key: "backache", label: "Backache" },
  { key: "chest_pain", label: "Chest Pain" },
  { key: "coughing", label: "Coughing" },
  { key: "joint_pain", label: "Joint Pain" },
];

type Step = "demographics" | "symptoms" | "result";

//  Main
export default function App() {
  const [form, setForm] = useState<PatientData>({
    age: 25,
    sex: 1,
    fever: 0,
    headache: 0,
    abdominal_pain: 0,
    malaise: 0,
    dizziness: 0,
    vomiting: 0,
    confusion: 0,
    backache: 0,
    chest_pain: 0,
    coughing: 0,
    joint_pain: 0,
  });

  const [location, setLocation] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("demographics");
  const [shakeSymptoms, setShakeSymptoms] = useState(false);

  const symptomCount = SYMPTOMS.reduce(
    (n, s) => n + (form[s.key] as number),
    0,
  );

  const handleChange = (key: keyof PatientData, value: number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const goToSymptoms = () => setStep("symptoms");

  const handleSubmit = async () => {
    if (symptomCount === 0) {
      setShakeSymptoms(true);
      setTimeout(() => setShakeSymptoms(false), 600);
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await predictMalaria(form);
      setResult(res);
      setStep("result");
    } catch {
      alert("Backend error — make sure the FastAPI server is running.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep("demographics");
    setResult(null);
  };

  const positive = result?.prediction === 1;
  const posProb = (result?.probabilities?.positive ?? 0) * 100;
  const negProb = (result?.probabilities?.negative ?? 0) * 100;
  const confPct = (result?.confidence ?? 0) * 100;

  const mapUrl = location
    ? `https://www.google.com/maps?q=hospitals+near+${encodeURIComponent(location)}&output=embed`
    : "";
  const mapHref = location
    ? `https://www.google.com/maps/search/hospitals+near+${encodeURIComponent(location)}`
    : "#";

  const pageVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #fffbf7 0%, #fff7ed 45%, #ffedd5 100%)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: -130,
          right: -130,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,146,60,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: -90,
          left: -90,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(253,186,116,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Page wrapper */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
            }}
          >
            🦟
          </div>
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 900,
              fontSize: "1.15rem",
              color: "#1c1917",
            }}
          >
            MalariaDx
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.67rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "#ea580c",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.22)",
              padding: "0.2rem 0.7rem",
              borderRadius: 999,
            }}
          >
            XGBoost · AUC 0.9984
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ marginBottom: "1.75rem" }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 6vw, 2.4rem)",
              color: "#1c1917",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "0.4rem",
            }}
          >
            Symptom-Based
            <br />
            <span style={{ color: "#f97316", fontStyle: "italic" }}>
              Diagnosis
            </span>
          </h1>
          <p
            style={{
              fontSize: "0.87rem",
              color: "#78716c",
              fontWeight: 300,
              lineHeight: 1.65,
            }}
          >
            AI-assisted malaria prediction · For clinical decision support only.
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StepDots current={step} />
        </motion.div>

        {/* ── Pages ── */}
        <AnimatePresence mode="wait">
          {/* ══ PAGE 1: Demographics ══ */}
          {step === "demographics" && (
            <Page1
              form={form}
              handleChange={handleChange}
              location={location}
              setLocation={setLocation}
              goToSymptoms={goToSymptoms}
              pageVariants={pageVariants}
            ></Page1>
          )}

          {/* ══ PAGE 2: Symptoms ══ */}
          {step === "symptoms" && (
            <motion.div
              key="symptoms"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <Card>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <SectionLabel num="03" text="Presenting Symptoms" />
                  <AnimatePresence mode="wait">
                    {symptomCount > 0 ? (
                      <motion.span
                        key="count"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: symptomCount >= 4 ? "#c2410c" : "#d97706",
                          background:
                            symptomCount >= 4
                              ? "rgba(194,65,12,0.1)"
                              : "rgba(217,119,6,0.1)",
                          border: `1px solid ${
                            symptomCount >= 4
                              ? "rgba(194,65,12,0.2)"
                              : "rgba(217,119,6,0.2)"
                          }`,
                          padding: "0.2rem 0.65rem",
                          borderRadius: 999,
                        }}
                      >
                        {symptomCount} selected
                      </motion.span>
                    ) : (
                      <motion.span
                        key="none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 500,
                          color: "#c2410c",
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          padding: "0.2rem 0.65rem",
                          borderRadius: 999,
                        }}
                      >
                        Select at least 1
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div
                  className={`sym-grid${shakeSymptoms ? " shake" : ""}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(155px, 1fr))",
                    gap: "0.5rem",
                  }}
                >
                  {SYMPTOMS.map(({ key, label }, i) => (
                    <motion.div
                      key={key}
                      className="sym-pill"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: i * 0.04,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`sym-${key}`}
                        checked={form[key] === 1}
                        onChange={(e) =>
                          handleChange(key, e.target.checked ? 1 : 0)
                        }
                      />
                      <label htmlFor={`sym-${key}`}>{label}</label>
                    </motion.div>
                  ))}
                </div>

                {/* Validation notice */}
                <AnimatePresence>
                  {shakeSymptoms && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.65rem 0.9rem",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      Please select at least one symptom before running the
                      diagnosis.
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "0.6rem",
                }}
              >
                <motion.button
                  onClick={() => setStep("demographics")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "0.85rem",
                    background: "transparent",
                    border: "1.5px solid #e8ddd2",
                    borderRadius: 12,
                    color: "#78716c",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f97316";
                    e.currentTarget.style.color = "#f97316";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e8ddd2";
                    e.currentTarget.style.color = "#78716c";
                  }}
                >
                  ← Back
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={
                    !loading
                      ? {
                          scale: 1.015,
                          boxShadow: "0 8px 28px rgba(249,115,22,0.38)",
                        }
                      : {}
                  }
                  whileTap={!loading ? { scale: 0.985 } : {}}
                  style={{
                    padding: "0.85rem 1.5rem",
                    background: loading
                      ? "#fcd9a8"
                      : symptomCount === 0
                        ? "#e8ddd2"
                        : "linear-gradient(135deg, #f97316, #ea580c)",
                    color: loading
                      ? "#c2410c"
                      : symptomCount === 0
                        ? "#a8a29e"
                        : "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'Fraunces', serif",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor:
                      loading || symptomCount === 0 ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                    boxShadow:
                      symptomCount > 0 && !loading
                        ? "0 4px 18px rgba(249,115,22,0.28)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.0,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ display: "inline-block" }}
                      >
                        ⏳
                      </motion.span>
                      Analysing…
                    </>
                  ) : (
                    "Run Diagnosis →"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ PAGE 3: Result ══ */}
          {step === "result" && result && (
            <motion.div
              key="result"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {/* Hero result card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  background: positive
                    ? "linear-gradient(135deg, #fff7ed, #ffedd5)"
                    : "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  border: `2px solid ${positive ? "#fed7aa" : "#bbf7d0"}`,
                  borderLeft: `5px solid ${positive ? "#f97316" : "#16a34a"}`,
                  borderRadius: 16,
                  padding: "clamp(1.25rem, 4vw, 2rem)",
                  marginBottom: "0.875rem",
                  boxShadow: positive
                    ? "0 8px 36px rgba(249,115,22,0.16)"
                    : "0 8px 36px rgba(22,163,74,0.12)",
                }}
              >
                <div
                  className="result-hero-inner"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.67rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: positive ? "#f97316" : "#16a34a",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Diagnosis Result
                    </p>
                    <h2
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 900,
                        fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
                        letterSpacing: "-0.03em",
                        color: positive ? "#c2410c" : "#15803d",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {positive ? "⚠ Malaria Positive" : "✓ Malaria Negative"}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "#78716c",
                        fontWeight: 300,
                        lineHeight: 1.55,
                        maxWidth: 300,
                      }}
                    >
                      {positive
                        ? "Recommend immediate clinical review and laboratory confirmation."
                        : "No malaria detected. Monitor if symptoms persist or worsen."}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        marginTop: "0.9rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        {
                          label: `${symptomCount} symptom${symptomCount !== 1 ? "s" : ""}`,
                          color: positive ? "#f97316" : "#16a34a",
                        },
                        {
                          label: form.age <= 18 ? "Pediatric" : "Adult",
                          color: "#78716c",
                        },
                        {
                          label: form.sex === 0 ? "Female" : "Male",
                          color: "#78716c",
                        },
                      ].map(({ label, color }) => (
                        <span
                          key={label}
                          style={{
                            fontSize: "0.71rem",
                            fontWeight: 600,
                            color,
                            background: "rgba(255,255,255,0.72)",
                            border: "1px solid rgba(0,0,0,0.08)",
                            padding: "0.22rem 0.65rem",
                            borderRadius: 999,
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="result-ring">
                    <ConfidenceRing pct={confPct} positive={positive} />
                  </div>
                </div>
              </motion.div>

              {/* Probability breakdown */}
              <Card>
                <SectionLabel num="—" text="Probability Breakdown" />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#a8a29e",
                    marginBottom: "0.85rem",
                    marginTop: "-0.5rem",
                  }}
                >
                  Hover over each bar for details.
                </p>
                <ProbBar
                  label="Negative (No Malaria)"
                  pct={negProb}
                  color="#16a34a"
                  delay={0.1}
                />
                <ProbBar
                  label="Positive (Malaria)"
                  pct={posProb}
                  color="#f97316"
                  delay={0.22}
                />
              </Card>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1.5px solid #f0e9e1",
                  borderRadius: 12,
                  padding: "0.85rem 1rem",
                  marginBottom: "0.875rem",
                  display: "flex",
                  gap: "0.55rem",
                  alignItems: "flex-start",
                }}
              >
                <p
                  style={{
                    fontSize: "0.77rem",
                    color: "#78716c",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  AI-based prediction for clinical decision support only. Does
                  not replace professional medical advice. Confirm with
                  laboratory testing.
                </p>
              </motion.div>

              {/* Hospital map — positive only */}
              <AnimatePresence>
                {positive && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    style={{ marginBottom: "0.875rem" }}
                  >
                    <div
                      style={{
                        background: "rgba(254,242,220,0.85)",
                        border: "1.5px solid #fed7aa",
                        borderRadius: 16,
                        padding: "clamp(1rem, 4vw, 1.5rem)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.67rem",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#f97316",
                          marginBottom: "0.35rem",
                        }}
                      >
                        Nearest Hospitals
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#c2410c",
                          fontWeight: 500,
                          marginBottom: "1rem",
                        }}
                      >
                        Urgent: Refer this patient to the nearest hospital
                        immediately.
                      </p>
                      {location ? (
                        <>
                          <div
                            style={{
                              borderRadius: 10,
                              overflow: "hidden",
                              border: "1.5px solid #fed7aa",
                            }}
                          >
                            <iframe
                              src={mapUrl}
                              width="100%"
                              height="300"
                              style={{ border: 0, display: "block" }}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                          <a
                            href={mapHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "block",
                              textAlign: "center",
                              marginTop: "0.75rem",
                              background:
                                "linear-gradient(135deg, #f97316, #ea580c)",
                              color: "#fff",
                              textDecoration: "none",
                              padding: "0.65rem 1.5rem",
                              borderRadius: 10,
                              fontFamily: "'Fraunces', serif",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
                            }}
                          >
                            🗺 Open Full Map & Get Directions →
                          </a>
                        </>
                      ) : (
                        <p
                          style={{
                            fontSize: "0.81rem",
                            color: "#a8a29e",
                            fontStyle: "italic",
                            background: "#fffaf6",
                            borderRadius: 8,
                            padding: "0.75rem 1rem",
                            border: "1px solid #f0e9e1",
                          }}
                        >
                          No location provided. Go back and enter a city/address
                          to see the hospital map.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* New diagnosis */}
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "0.78rem",
                  background: "transparent",
                  border: "1.5px solid #e8ddd2",
                  borderRadius: 12,
                  color: "#78716c",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#f97316";
                  e.currentTarget.style.color = "#f97316";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8ddd2";
                  e.currentTarget.style.color = "#78716c";
                }}
              >
                ← New Diagnosis
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <Footer></Footer>
      </div>
    </div>
  );
}
