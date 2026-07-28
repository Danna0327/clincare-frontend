import axiosClient from "./axiosClient";

/**
 * Crea un servicio CRUD estándar para un recurso REST.
 *
 * Esto define un "contrato" común (listar/obtener/crear/actualizar/eliminar)
 * que todos los recursos comparten (Liskov: cualquier servicio creado con
 * esta fábrica puede usarse de forma intercambiable donde se espere un
 * "recurso CRUD"). Cada servicio concreto puede extender este contrato con
 * métodos propios sin modificar la fábrica (principio Abierto/Cerrado).
 *
 * @param {string} basePath - path base del recurso, ej. "/pacientes"
 */
export function createCrudService(basePath) {
  return {
    listar: async () => {
      const { data } = await axiosClient.get(`${basePath}/`);
      return data;
    },
    obtener: async (id) => {
      const { data } = await axiosClient.get(`${basePath}/${id}`);
      return data;
    },
    crear: async (payload) => {
      const { data } = await axiosClient.post(`${basePath}/`, payload);
      return data;
    },
    actualizar: async (id, payload) => {
      const { data } = await axiosClient.put(`${basePath}/${id}`, payload);
      return data;
    },
    eliminar: async (id) => {
      const { data } = await axiosClient.delete(`${basePath}/${id}`);
      return data;
    },
  };
}
