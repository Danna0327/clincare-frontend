import { useEffect } from "react";

/**
 * Actualiza el título de la pestaña del navegador según la página activa.
 * Efecto secundario aislado en su propio hook (SRP).
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ClinCare` : "ClinCare";
  }, [title]);
}
