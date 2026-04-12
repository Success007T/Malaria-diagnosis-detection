export default function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <p
      style={{
        fontSize: "0.67rem",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#f97316",
        marginBottom: "1rem",
      }}
    >
      {num} · {text}
    </p>
  );
}