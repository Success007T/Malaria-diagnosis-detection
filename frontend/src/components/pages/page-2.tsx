import { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "motion/react";

import type { PatientData } from "../../types";
import Card from "../card";
import SectionLabel from "../SectionLabel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Symptom = {
  key: keyof PatientData;
  label: string;
  desc: string;
};

type TooltipPosition = {
  top: number;
  left: number;
};

type Props = {
  form: PatientData;
  handleChange: (key: keyof PatientData, value: number) => void;
  symptomCount: number;
  loading: boolean;
  shakeSymptoms: boolean;
  handleSubmit: () => void;
  goBack: () => void;
  pageVariants: any;
  symptoms: Symptom[];
};

// ─── Style Constants ──────────────────────────────────────────────────────────

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },

  symptomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
    gap: "0.5rem",
  },

  symptomPill: {
    overflow: "visible" as const,
  },

  badge: (count: number): React.CSSProperties => ({
    fontSize: "0.72rem",
    fontWeight: 600,
    padding: "0.2rem 0.65rem",
    borderRadius: 999,
    color: count >= 4 ? "#c2410c" : "#d97706",
    background: count >= 4 ? "rgba(194,65,12,0.1)" : "rgba(217,119,6,0.1)",
  }),

  emptyBadge: {
    fontSize: "0.72rem",
    fontWeight: 500,
    color: "#c2410c",
    background: "rgba(239,68,68,0.08)",
    padding: "0.2rem 0.65rem",
    borderRadius: 999,
  } as React.CSSProperties,

  validationError: {
    marginTop: "0.75rem",
    padding: "0.65rem 0.9rem",
    background: "rgba(239,68,68,0.08)",
    borderRadius: 8,
    fontSize: "0.8rem",
    color: "#dc2626",
  } as React.CSSProperties,

  buttonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "0.6rem",
  } as React.CSSProperties,

  backButton: {
    background: "transparent",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "0.7rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
  } as React.CSSProperties,

  submitButton: (disabled: boolean): React.CSSProperties => ({
    background: disabled
      ? "linear-gradient(135deg, #fdba74 0%, #fb923c 100%)"
      : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    border: "none",
    borderRadius: 10,
    padding: "0.7rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    boxShadow: disabled ? "none" : "0 4px 14px rgba(249,115,22,0.4)",
    letterSpacing: "0.01em",
    transition: "box-shadow 0.2s ease",
  }),

  tooltip: (pos: TooltipPosition): React.CSSProperties => ({
    position: "fixed",
    top: pos.top - 10,
    left: pos.left,
    transform: "translate(-50%, -100%)",
    zIndex: 9999,
    pointerEvents: "none",
    width: "13rem",
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(12px)",
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
    padding: "0.75rem 0.9rem",
  }),

  tooltipTitle: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#1c1917",
    marginBottom: "0.25rem",
  } as React.CSSProperties,

  tooltipBody: {
    fontSize: "0.7rem",
    color: "#78716c",
    lineHeight: 1.55,
    margin: 0,
  } as React.CSSProperties,
} as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const BADGE_VARIANTS = {
  initial: { scale: 0.7, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.7, opacity: 0 },
};

const TOOLTIP_VARIANTS = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

const PILL_VARIANTS = (index: number) => ({
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: index * 0.04, duration: 0.25, ease: "easeOut" as const },
});

const ERROR_VARIANTS = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SymptomBadge({ count }: { count: number }) {
  return (
    <AnimatePresence mode="wait">
      {count > 0 ? (
        <motion.span key="count" {...BADGE_VARIANTS} style={styles.badge(count)}>
          {count} selected
        </motion.span>
      ) : (
        <motion.span
          key="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.emptyBadge}
        >
          Select at least 1
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function SymptomTooltip({
  symptom,
  position,
}: {
  symptom: Symptom;
  position: TooltipPosition;
}) {
  return ReactDOM.createPortal(
    <motion.div
      key={symptom.key}
      {...TOOLTIP_VARIANTS}
      transition={{ duration: 0.15 }}
      style={styles.tooltip(position)}
    >
      <p style={styles.tooltipTitle}>{symptom.label}</p>
      <p style={styles.tooltipBody}>{symptom.desc}</p>
    </motion.div>,
    document.body
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Page2({
  form,
  handleChange,
  symptomCount,
  loading,
  shakeSymptoms,
  handleSubmit,
  goBack,
  pageVariants,
  symptoms,
}: Props) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);

  const hoveredSymptom = symptoms.find((s) => s.key === hoveredKey) ?? null;

  function handleSymptomEnter(e: React.MouseEvent, key: string) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 });
    setHoveredKey(key);
  }

  function handleSymptomLeave() {
    setHoveredKey(null);
    setTooltipPos(null);
  }

  return (
    <motion.div
      key="symptoms"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Card>
        {/* ── Section Header ── */}
        <div style={styles.header}>
          <SectionLabel num="03" text="Presenting Symptoms" />
          <SymptomBadge count={symptomCount} />
        </div>

        {/* ── Symptoms Grid ── */}
        <div className={`sym-grid${shakeSymptoms ? " shake" : ""}`} style={styles.symptomGrid}>
          {symptoms.map(({ key, label }, i) => (
            <motion.div
              key={key}
              className="relative sym-pill"
              style={styles.symptomPill}
              {...PILL_VARIANTS(i)}
              onMouseEnter={(e) => handleSymptomEnter(e, key)}
              onMouseLeave={handleSymptomLeave}
            >
              <input
                type="checkbox"
                id={`sym-${key}`}
                checked={form[key] === 1}
                onChange={(e) => handleChange(key, e.target.checked ? 1 : 0)}
              />
              <label htmlFor={`sym-${key}`}>{label}</label>
            </motion.div>
          ))}
        </div>

        {/* ── Tooltip (portal) ── */}
        <AnimatePresence>
          {hoveredSymptom && tooltipPos && (
            <SymptomTooltip symptom={hoveredSymptom} position={tooltipPos} />
          )}
        </AnimatePresence>

        {/* ── Validation Error ── */}
        <AnimatePresence>
          {shakeSymptoms && (
            <motion.div {...ERROR_VARIANTS} style={styles.validationError}>
              Please select at least one symptom.
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Navigation Buttons ── */}
      <div style={styles.buttonRow}>
        <motion.button
          onClick={goBack}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={styles.backButton}
        >
          ← Back
        </motion.button>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.015, boxShadow: "0 6px 20px rgba(249,115,22,0.55)" }}
          whileTap={loading ? {} : { scale: 0.985 }}
          style={styles.submitButton(loading)}
        >
          {loading ? "Analysing…" : "Run Diagnosis →"}
        </motion.button>
      </div>
    </motion.div>
  );
}