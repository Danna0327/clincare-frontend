import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeartPulse, User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/FormControls";

export default function LoginPage() {
  usePageTitle("Iniciar sesión");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.detail || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Panel izquierdo: branding */}
      <div
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #4c7cf7 0%, #2f5be0 55%, #1f3f9e 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
        className="login-hero"
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <HeartPulse size={28} />
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
          ClinCare
        </h1>
        <p style={{ fontSize: 16, opacity: 0.9, marginTop: 12, maxWidth: 380, lineHeight: 1.6 }}>
          Sistema de gestión de citas médicas: pacientes, colaboradores y
          agenda clínica en un solo lugar.
        </p>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16 }}>
          {["Agenda y estados de citas en tiempo real", "Historial clínico por paciente", "Gestión de médicos y especialidades"].map(
            (item) => (
              <div key={item} className="flex-row" style={{ fontSize: 14, opacity: 0.95 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Bienvenida de nuevo
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <Alert message={error} onClose={() => setError("")} />

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Usuario">
              <div className="input-with-icon">
                <User size={16} />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  minLength={3}
                />
              </div>
            </Field>

            <Field label="Contraseña">
              <div className="input-with-icon">
                <Lock size={16} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </Field>

            <Button type="submit" className="btn-block" loading={loading} style={{ marginTop: 8 }}>
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
