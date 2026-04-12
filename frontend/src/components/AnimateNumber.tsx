import { useState, useEffect } from "react";
import { animate } from "framer-motion";

export default function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);
  return (
    <>
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}
