import axiosClient from "./axiosClient";
import { createCrudService } from "./createCrudService";

const BASE = "/citas";
const baseCrud = createCrudService(BASE);

/**
 * El servicio de citas extiende el contrato CRUD genérico con las
 * operaciones propias del dominio (cambio de estado y consulta por
 * cédula), sin tener que reimplementar listar/crear/actualizar/eliminar.
 */
export const citaService = {
  ...baseCrud,

  // RF-09: transición de estado (PENDIENTE -> ATENDIDA/CANCELADA)
  cambiarEstado: async (id, estado) => {
    const { data } = await axiosClient.patch(`${BASE}/${id}/estado`, {
      estado,
    });
    return data;
  },

  // RF-10: servicio REST que retorna el historial de citas por cédula
  consultarPorCedula: async (cedula) => {
    const { data } = await axiosClient.get(`${BASE}/paciente/${cedula}`);
    return data;
  },
};
