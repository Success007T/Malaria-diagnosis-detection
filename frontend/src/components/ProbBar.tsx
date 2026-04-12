import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimateNumber";

export default function ProbBar({
  label,
  pct,
  color,
  delay,
}: {
  label: string;
  pct: number;
  color: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.96)"
          : "rgba(255,255,255,0.65)",
        border: hovered ? `1.5px solid ${color}` : "1.5px solid #f0e9e1",
        borderRadius: 12,
        padding: "0.9rem 1.1rem",
        marginBottom: "0.6rem",
        cursor: "default",
        transition: "all 0.2s ease",
        boxShadow: hovered
          ? `0 4px 20px ${color}30`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <motion.div
            animate={{ scale: hovered ? 1.2 : 1 }}
            transition={{ duration: 0.15 }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
              boxShadow: hovered ? `0 0 6px ${color}` : "none",
            }}
          />
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#44403c",
            }}
          >
            {label}
          </span>
        </div>
        <motion.span
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 900,
            fontSize: "1.1rem",
            color,
          }}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <AnimatedNumber value={pct} suffix="%" decimals={1} />
        </motion.span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.0, ease: "easeOut", delay: delay + 0.15 }}
          style={{
            height: "100%",
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </motion.div>
  );
}
