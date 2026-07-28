import { useCallback, useEffect, useState } from "react";

/**
 * Hook genérico para consumir un servicio con el contrato CRUD estándar.
 *
 * Las páginas dependen de este hook (una abstracción), no directamente
 * de axios ni de un servicio concreto — así, si el origen de datos
 * cambiara, solo cambiaría el servicio inyectado, no cada página
 * (principio de Inversión de Dependencias).
 *
 * @param {object} service - objeto con métodos listar/crear/actualizar/eliminar
 * @param {object} [options]
 * @param {boolean} [options.auto=true] - si debe cargar automáticamente al montar
 */
export function useResource(service, { auto = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await service.listar();
      setItems(data);
      return data;
    } catch (err) {
      setError(err.detail || "No se pudieron cargar los datos.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (auto) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const crear = useCallback(
    async (payload) => {
      const nuevo = await service.crear(payload);
      await cargar();
      return nuevo;
    },
    [service, cargar]
  );

  const actualizar = useCallback(
    async (id, payload) => {
      const actualizado = await service.actualizar(id, payload);
      await cargar();
      return actualizado;
    },
    [service, cargar]
  );

  const eliminar = useCallback(
    async (id) => {
      await service.eliminar(id);
      await cargar();
    },
    [service, cargar]
  );

  return {
    items,
    loading,
    error,
    setError,
    recargar: cargar,
    crear,
    actualizar,
    eliminar,
  };
}
