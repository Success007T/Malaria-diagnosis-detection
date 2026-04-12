import { motion } from "framer-motion";

const Footer = () => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7 }}
    style={{
      fontSize: "0.71rem",
      color: "#a8a29e",
      textAlign: "center",
      marginTop: "2rem",
      lineHeight: 1.75,
    }}
  >
    Clinical decision support only · Not a substitute for professional medical
    advice
    <br />
    Map data © Google Maps
  </motion.p>
);
export default Footer;
