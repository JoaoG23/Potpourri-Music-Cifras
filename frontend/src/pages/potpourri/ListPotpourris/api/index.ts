import { api } from "../../../../services/endpoint";
import type { PotpourrisResponse } from "../../../../types/potpourri";

export const getPotpourriList = async (page: number = 1, perPage: number = 10): Promise<PotpourrisResponse> => {
  const response = await api.get('/potpourri', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

export const searchPotpourriList = async (searchTerm: string, page: number = 1, perPage: number = 10): Promise<PotpourrisResponse> => {
  const response = await api.get('/potpourri/search', {
    params: { q: searchTerm, page, per_page: perPage }
  });
  return response.data;
};
