const PALETTE = ["#3b6df0", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

function colorFor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function Avatar({ name = "", size = 36 }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: colorFor(name || "?"),
        fontSize: size * 0.36,
      }}
    >
      {initials || "?"}
    </div>
  );
}
