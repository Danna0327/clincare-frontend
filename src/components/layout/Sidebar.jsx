import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  CalendarPlus,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/colaboradores", label: "Colaboradores", icon: Stethoscope },
  { to: "/citas", label: "Citas", icon: CalendarDays },
  { to: "/citas/nueva", label: "Nueva cita", icon: CalendarPlus },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside
      style={{
        background: "#fff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
      }}
    >
      <div className="flex-row" style={{ padding: "0 8px 28px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--primary-600)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <HeartPulse size={20} />
        </div>
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" }}>
          ClinCare
        </span>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? "var(--primary-700)" : "var(--text-secondary)",
                background: isActive ? "var(--primary-50)" : "transparent",
              })}
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <div className="flex-row" style={{ marginBottom: 12 }}>
          <Avatar name={user?.username || "?"} size={34} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.username}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Sesión activa</div>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-block btn-sm"
          onClick={logout}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
