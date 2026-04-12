export default function Card({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        border: "1.5px solid #f0e9e1",
        borderRadius: 16,
        padding: "clamp(1.1rem, 4vw, 1.5rem)",
        marginBottom: "0.875rem",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
