import { useCallback, useState } from "react";
import { citaService } from "../api/citaService";
import { useResource } from "./useResource";

/**
 * Hook específico de Citas. Reutiliza useResource para el CRUD estándar
 * y añade las operaciones propias del dominio (cambio de estado,
 * consulta por cédula) sin duplicar la lógica de carga/estado.
 */
export function useCitas() {
  const resource = useResource(citaService);

  const [cedulaResultado, setCedulaResultado] = useState(null);
  const [buscandoCedula, setBuscandoCedula] = useState(false);
  const [errorCedula, setErrorCedula] = useState("");

  const cambiarEstado = useCallback(
    async (id, estado) => {
      await citaService.cambiarEstado(id, estado);
      await resource.recargar();
    },
    [resource]
  );

  const buscarPorCedula = useCallback(async (cedula) => {
    setErrorCedula("");
    setCedulaResultado(null);
    setBuscandoCedula(true);
    try {
      const data = await citaService.consultarPorCedula(cedula);
      setCedulaResultado(data);
      return data;
    } catch (err) {
      setErrorCedula(err.detail || "No se encontraron citas para esa cédula.");
      throw err;
    } finally {
      setBuscandoCedula(false);
    }
  }, []);

  return {
    ...resource,
    cambiarEstado,
    buscarPorCedula,
    cedulaResultado,
    buscandoCedula,
    errorCedula,
    setErrorCedula,
  };
}
