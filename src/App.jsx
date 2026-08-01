import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PacientesPage from "./pages/PacientesPage";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import CitasPage from "./pages/CitasPage";
import NuevaCitaPage from "./pages/NuevaCitaPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="colaboradores" element={<ColaboradoresPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="citas/nueva" element={<NuevaCitaPage />} />
        </Route>

        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </AuthProvider>
  );
}
