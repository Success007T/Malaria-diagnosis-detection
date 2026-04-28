import type { PatientData } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const predictMalaria = async (data: PatientData) => {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("API error");

  return res.json();
};