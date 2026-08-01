import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  usePageTitle("Página no encontrada");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--primary-50)",
          color: "var(--primary-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CompassIcon size={30} />
      </div>
      <h1 style={{ fontSize: 22, margin: 0 }}>Página no encontrada</h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 340 }}>
        La ruta que buscas no existe o fue movida. Vuelve al dashboard para continuar.
      </p>
      <Link to="/">
        <Button>Ir al dashboard</Button>
      </Link>
    </div>
  );
}
