import { motion, AnimatePresence } from "motion/react";

import Card from "../card";
import SectionLabel from "../SectionLabel";
import ConfidenceRing from "../confidenceRing";
import ProbBar from "../ProbBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type PatientMeta = {
  age: number | string;
  sex: number;
};

type Props = {
  result: any;
  positive: boolean;
  symptomCount: number;
  form: PatientMeta;
  confPct: number;
  negProb: number;
  posProb: number;
  location: string;
  mapUrl: string;
  mapHref: string;
  contactMailHref: string;
  handleReset: () => void;
  pageVariants: any;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgeGroup(age: number | string): string {
  return Number(age) <= 18 ? "Pediatric" : "Adult";
}

function getSexLabel(sex: number): string {
  return sex === 0 ? "Female" : "Male";
}

// ─── Style Constants ──────────────────────────────────────────────────────────

const ORANGE = "#f97316";
const ORANGE_DARK = "#ea580c";
const GREEN = "#16a34a";

const styles = {
  // Hero card
  heroBorder: (positive: boolean) =>
    ({
      background: positive
        ? "linear-gradient(135deg, #fff7ed, #ffedd5)"
        : "linear-gradient(135deg, #f0fdf4, #dcfce7)",
      border: `2px solid ${positive ? "#fed7aa" : "#bbf7d0"}`,
      borderLeft: `5px solid ${positive ? ORANGE : GREEN}`,
      borderRadius: 16,
      padding: "clamp(1.25rem, 4vw, 2rem)",
      marginBottom: "0.875rem",
      boxShadow: positive
        ? "0 8px 36px rgba(249,115,22,0.16)"
        : "0 8px 36px rgba(22,163,74,0.12)",
    }) as React.CSSProperties,

  heroInner: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  } as React.CSSProperties,

  heroContent: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  diagnosisLabel: (positive: boolean) =>
    ({
      fontSize: "0.67rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: positive ? ORANGE : GREEN,
      marginBottom: "0.4rem",
    }) as React.CSSProperties,

  diagnosisHeading: (positive: boolean) =>
    ({
      fontFamily: "'Fraunces', serif",
      fontWeight: 900,
      fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
      letterSpacing: "-0.03em",
      color: positive ? "#c2410c" : "#15803d",
      marginBottom: "0.35rem",
    }) as React.CSSProperties,

  diagnosisSubtext: {
    fontSize: "0.84rem",
    color: "#78716c",
    fontWeight: 300,
    lineHeight: 1.55,
    maxWidth: 300,
  } as React.CSSProperties,

  tagRow: {
    display: "flex",
    gap: "0.4rem",
    marginTop: "0.9rem",
    flexWrap: "wrap",
  } as React.CSSProperties,

  tag: (color: string) =>
    ({
      fontSize: "0.71rem",
      fontWeight: 600,
      color,
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "0.22rem 0.65rem",
      borderRadius: 999,
    }) as React.CSSProperties,

  // Probability hint
  probHint: {
    fontSize: "0.75rem",
    color: "#a8a29e",
    marginBottom: "0.85rem",
    marginTop: "-0.5rem",
  } as React.CSSProperties,

  // Disclaimer
  disclaimer: {
    background: "rgba(255,255,255,0.6)",
    border: "1.5px solid #f0e9e1",
    borderRadius: 12,
    padding: "0.85rem 1rem",
    marginBottom: "0.875rem",
    display: "flex",
    gap: "0.55rem",
    alignItems: "flex-start",
  } as React.CSSProperties,

  disclaimerText: {
    fontSize: "0.77rem",
    color: "#78716c",
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,

  // Hospital map section
  mapCard: {
    background: "rgba(254,242,220,0.85)",
    border: "1.5px solid #fed7aa",
    borderRadius: 16,
    padding: "clamp(1rem, 4vw, 1.5rem)",
  } as React.CSSProperties,

  mapCardWrapper: {
    marginBottom: "0.875rem",
  } as React.CSSProperties,

  mapSectionLabel: {
    fontSize: "0.67rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: ORANGE,
    marginBottom: "0.35rem",
  } as React.CSSProperties,

  mapUrgencyText: {
    fontSize: "0.8rem",
    color: "#c2410c",
    fontWeight: 500,
    marginBottom: "1rem",
  } as React.CSSProperties,

  mapIframeWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    border: "1.5px solid #fed7aa",
  } as React.CSSProperties,

  mapIframe: {
    border: 0,
    display: "block",
  } as React.CSSProperties,

  mapLink: {
    display: "block",
    textAlign: "center" as const,
    marginTop: "0.75rem",
    background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
    color: "#fff",
    textDecoration: "none",
    padding: "0.65rem 1.5rem",
    borderRadius: 10,
    fontFamily: "'Fraunces', serif",
    fontWeight: 700,
    fontSize: "0.85rem",
    boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
  } as React.CSSProperties,

  noLocationText: {
    fontSize: "0.81rem",
    color: "#a8a29e",
    fontStyle: "italic" as const,
    background: "#fffaf6",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    border: "1px solid #f0e9e1",
  } as React.CSSProperties,

  // Reset button
  resetButton: {
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
  } as React.CSSProperties,

  // Contact card
  contactCard: {
    background: "rgba(255,255,255,0.65)",
    border: "1.5px solid #f0e9e1",
    borderRadius: 14,
    padding: "1rem 1.1rem",
    marginBottom: "0.875rem",
  } as React.CSSProperties,

  contactTitle: {
    fontSize: "0.67rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#a8a29e",
    marginBottom: "0.75rem",
  } as React.CSSProperties,

  contactRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "0.5rem",
  } as React.CSSProperties,

  contactIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "rgba(249,115,22,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    flexShrink: 0,
  } as React.CSSProperties,

  contactLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#a8a29e",
    marginBottom: "0.1rem",
  } as React.CSSProperties,

  contactValue: {
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#1c1917",
    textDecoration: "none",
  } as React.CSSProperties,

  contactEmailBtn: {
    display: "block",
    marginTop: "0.85rem",
    textAlign: "center" as const,
    background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
    color: "#fff",
    textDecoration: "none",
    padding: "0.6rem 1.25rem",
    borderRadius: 10,
    fontSize: "0.8rem",
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(249,115,22,0.28)",
    letterSpacing: "0.01em",
  } as React.CSSProperties,
} as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const HERO_VARIANTS = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const },
};

const DISCLAIMER_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.4 },
};

const MAP_VARIANTS = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { delay: 0.45, duration: 0.4 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DiagnosisTags({
  symptomCount,
  form,
  positive,
}: {
  symptomCount: number;
  form: PatientMeta;
  positive: boolean;
}) {
  const tags = [
    {
      label: `${symptomCount} symptom${symptomCount === 1 ? "" : "s"}`,
      color: positive ? ORANGE : GREEN,
    },
    { label: getAgeGroup(form.age), color: "#78716c" },
    { label: getSexLabel(form.sex), color: "#78716c" },
  ];

  return (
    <div style={styles.tagRow}>
      {tags.map(({ label, color }) => (
        <span key={label} style={styles.tag(color)}>
          {label}
        </span>
      ))}
    </div>
  );
}

function HospitalMap({
  location,
  mapUrl,
  mapHref,
}: {
  location: string;
  mapUrl: string;
  mapHref: string;
}) {
  return (
    <AnimatePresence>
      <motion.div {...MAP_VARIANTS} style={styles.mapCardWrapper}>
        <div style={styles.mapCard}>
          <p style={styles.mapSectionLabel}>Nearest Hospitals</p>

          <p style={styles.mapUrgencyText}>
            Urgent: Refer this patient to the nearest hospital immediately.
          </p>

          {location ? (
            <>
              <div style={styles.mapIframeWrapper}>
                <iframe
                  title="Nearest Hospitals Map"
                  src={mapUrl}
                  width="100%"
                  height="300"
                  style={styles.mapIframe}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapLink}
              >
                🗺 Open Full Map & Get Directions →
              </a>
            </>
          ) : (
            <p style={styles.noLocationText}>
              No location provided. Go back and enter a city/address to see the
              hospital map.
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ContactCard({ mailHref }: { mailHref: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.35 }}
      style={styles.contactCard}
    >
      <p style={styles.contactTitle}>Contact NMEP</p>

      {/* Phone */}
      <div style={styles.contactRow}>
        <div style={styles.contactIcon}>📞</div>
        <div>
          <p style={styles.contactLabel}>Phone</p>
          <a href="tel:+23496712135" style={styles.contactValue}>
            +234 9 671 2135
          </a>
        </div>
      </div>

      {/* Email */}
      <div style={styles.contactRow}>
        <div style={styles.contactIcon}>✉️</div>
        <div>
          <p style={styles.contactLabel}>Email</p>
          <a href={`mailto:info@nmep.gov.ng`} style={styles.contactValue}>
            info@nmep.gov.ng
          </a>
        </div>
      </div>

      {/* Send report CTA */}
      <button
        onClick={() => window.open(mailHref, "_blank")}
        style={styles.contactEmailBtn}
      >
        📋 Send Diagnosis Report via Email →
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Page3({
  positive,
  symptomCount,
  form,
  confPct,
  negProb,
  posProb,
  location,
  mapUrl,
  mapHref,
  contactMailHref,
  handleReset,
  pageVariants,
}: Props) {
  return (
    <motion.div
      key="result"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeInOut" as const }}
    >
      {/* ── Hero Result Card ── */}
      <motion.div {...HERO_VARIANTS} style={styles.heroBorder(positive)}>
        <div className="result-hero-inner" style={styles.heroInner}>
          <div style={styles.heroContent}>
            <p style={styles.diagnosisLabel(positive)}>Diagnosis Result</p>

            <h2 style={styles.diagnosisHeading(positive)}>
              {positive ? "⚠ Malaria Positive" : "✓ Malaria Negative"}
            </h2>

            <p style={styles.diagnosisSubtext}>
              {positive
                ? "Recommend immediate clinical review and laboratory confirmation."
                : "No malaria detected. Monitor if symptoms persist or worsen."}
            </p>

            <DiagnosisTags
              symptomCount={symptomCount}
              form={form}
              positive={positive}
            />
          </div>

          <div className="result-ring">
            <ConfidenceRing pct={confPct} positive={positive} />
          </div>
        </div>
      </motion.div>

      {/* ── Probability Breakdown ── */}
      <Card>
        <SectionLabel num="—" text="Probability Breakdown" />

        <p style={styles.probHint}>Hover over each bar for details.</p>

        <ProbBar
          label="Negative (No Malaria)"
          pct={negProb}
          color={GREEN}
          delay={0.1}
        />
        <ProbBar
          label="Positive (Malaria)"
          pct={posProb}
          color={ORANGE}
          delay={0.22}
        />
      </Card>

      {/* ── Disclaimer ── */}
      <motion.div {...DISCLAIMER_VARIANTS} style={styles.disclaimer}>
        <p style={styles.disclaimerText}>
          AI-based prediction for clinical decision support only. Does not
          replace professional medical advice. Confirm with laboratory testing.
        </p>
      </motion.div>

      {/* ── Hospital Map (positive only) ── */}
      {positive && (
        <HospitalMap location={location} mapUrl={mapUrl} mapHref={mapHref} />
      )}

      {/* ── Contact Card ── */}
      <ContactCard mailHref={contactMailHref} />

      {/* ── Reset Button ── */}
      <motion.button
        onClick={handleReset}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={styles.resetButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = ORANGE;
          e.currentTarget.style.color = ORANGE;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e8ddd2";
          e.currentTarget.style.color = "#78716c";
        }}
      >
        ← New Diagnosis
      </motion.button>
    </motion.div>
  );
}