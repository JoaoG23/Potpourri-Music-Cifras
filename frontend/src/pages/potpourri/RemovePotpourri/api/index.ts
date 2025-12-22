import { api } from "../../../../services/endpoint";

export const deletePotpourri = async (id: number): Promise<void> => {
  const response = await api.delete(`/potpourri/${id}`);
  return response.data;
};
export const getPotpourriById = async (id: number) => {
  const response = await api.get(`/potpourri/${id}`);
  return response.data;
};