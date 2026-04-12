import { motion } from "framer-motion";
import AnimatedNumber from "./AnimateNumber";

export default function ConfidenceRing({
  pct,
  positive,
}: {
  pct: number;
  positive: boolean;
}) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color = positive ? "#f97316" : "#16a34a";

  return (
    <div
      style={{
        position: "relative",
        width: 140,
        height: 140,
        flexShrink: 0,
      }}
    >
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="11"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.1,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.15,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 900,
            fontSize: "1.5rem",
            color,
            lineHeight: 1,
          }}
        >
          <AnimatedNumber value={pct} suffix="%" decimals={1} />
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            color: "#a8a29e",
            fontWeight: 500,
            letterSpacing: "0.05em",
            marginTop: 3,
          }}
        >
          confidence
        </span>
      </div>
    </div>
  );
}
