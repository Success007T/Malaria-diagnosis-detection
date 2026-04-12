import { motion } from "framer-motion";

export type Step = "demographics" | "symptoms" | "result";

export default function StepDots({ current }: { current: Step }) {
  const steps: Step[] = ["demographics", "symptoms", "result"];
  const labels = ["Patient Info", "Symptoms", "Results"];
  const idx = steps.indexOf(current);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      {steps.map((s, i) => (
        <div
          key={s}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <motion.div
              animate={{
                background:
                  i <= idx
                    ? "linear-gradient(135deg, #f97316, #ea580c)"
                    : "#e8ddd2",
                scale: i === idx ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: i <= idx ? "#fff" : "#a8a29e",
                boxShadow:
                  i === idx ? "0 4px 12px rgba(249,115,22,0.4)" : "none",
              }}
            >
              {i < idx ? "✓" : i + 1}
            </motion.div>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 500,
                color: i === idx ? "#f97316" : "#a8a29e",
                whiteSpace: "nowrap",
              }}
            >
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <motion.div
              animate={{ background: i < idx ? "#f97316" : "#e8ddd2" }}
              transition={{ duration: 0.4 }}
              style={{
                width: 40,
                height: 2,
                borderRadius: 99,
                marginBottom: 14,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
