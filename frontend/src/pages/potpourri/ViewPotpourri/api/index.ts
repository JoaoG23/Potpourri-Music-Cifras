import { api } from "../../../../services/endpoint";
import type { ViewPotpourriResponse } from "../../../../types/potpourri";

export const getPotpourriMusics = async (potpourriId: number, page: number = 1, perPage: number = 50): Promise<ViewPotpourriResponse> => {
  const response = await api.get(`/musicas-potpourri/by-potpourri/${potpourriId}`, {
    params: { page, per_page: perPage }
  });
  return response.data;
};
