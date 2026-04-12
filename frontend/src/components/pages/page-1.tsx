import Card from "../card";
import { motion } from "framer-motion";
import SectionLabel from "../SectionLabel";

type Page1Props = {
  form: any; 
  handleChange: any;
  location: any;
  setLocation: any;
  goToSymptoms: any;
  pageVariants: any;
};

export default function Page1({
  form,
  handleChange,
  location,
  setLocation,
  goToSymptoms,
  pageVariants,
}: Page1Props) {
  return (
    <motion.div
      key="demographics"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Card>
        <SectionLabel num="01" text="Patient Demographics" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#78716c",
                marginBottom: "0.35rem",
              }}
            >
              Age (years)
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={form.age}
              onChange={(e) => handleChange("age", Number(e.target.value))}
              className="field-input"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#78716c",
                marginBottom: "0.35rem",
              }}
            >
              Biological Sex
            </label>
            <select
              value={form.sex}
              onChange={(e) => handleChange("sex", Number(e.target.value))}
              className="field-input"
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel num="02" text="Patient Location" />
        <p
          style={{
            fontSize: "0.75rem",
            color: "#a8a29e",
            marginBottom: "0.85rem",
            marginTop: "-0.5rem",
          }}
        >
          Used to find nearby hospitals if the result is positive.
        </p>
        <input
          type="text"
          placeholder="e.g. Abuja, Nigeria"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="field-input"
        />
      </Card>

      <motion.button
        onClick={goToSymptoms}
        whileHover={{
          scale: 1.015,
          boxShadow: "0 8px 28px rgba(249,115,22,0.38)",
        }}
        whileTap={{ scale: 0.985 }}
        style={{
          width: "100%",
          padding: "0.9rem 2rem",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontFamily: "'Fraunces', serif",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 20px rgba(249,115,22,0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
        }}
      >
        Continue to Symptoms →
      </motion.button>
    </motion.div>
  );
}
