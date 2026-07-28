export default function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const tones = {
    primary: { bg: "var(--primary-50)", color: "var(--primary-600)" },
    teal: { bg: "#f0fdfa", color: "var(--accent-teal)" },
    amber: { bg: "#fffaeb", color: "var(--accent-amber)" },
    green: { bg: "#ecfdf3", color: "var(--accent-green)" },
  };
  const t = tones[tone] || tones.primary;

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: t.bg, color: t.color }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-title">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
