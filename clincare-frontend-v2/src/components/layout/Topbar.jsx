import { Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 32px",
        borderBottom: "1px solid var(--border)",
        background: "#fff",
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("es-EC", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>
          {saludo()}, {user?.username} 👋
        </div>
      </div>

      <div className="flex-row">
        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>
        <button className="btn btn-ghost btn-icon" aria-label="Notificaciones">
          <Bell size={19} />
        </button>
      </div>
    </header>
  );
}

