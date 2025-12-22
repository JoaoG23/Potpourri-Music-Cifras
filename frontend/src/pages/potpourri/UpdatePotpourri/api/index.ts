import { api } from "../../../../services/endpoint";
import type { MusicsResponse } from "../../../../types/music";
import type { Potpourri, ViewPotpourriResponse, MusicaPotpourri } from "../../../../types/potpourri";

export interface UpdatePotpourriRequest {
  nome_potpourri?: string;
  musicas_potpourri: MusicaPotpourri[];
}

export interface UpdatePotpourriResponse {
  message: string;
  data: {
    potpourri: Potpourri;
    musicas_potpourri: MusicaPotpourri[];
    total_musicas: number;
  };
}

export const getMusicList = async (
  page: number = 1,
  perPage: number = 50,
  search: string = ""
): Promise<MusicsResponse> => {
  const params: { page: number; per_page: number; search?: string } = { page, per_page: perPage };
  if (search) {
    params.search = search;
  }
  const response = await api.get("/musicas", { params });
  return response.data;
};

export const getPotpourriById = async (id: number): Promise<{ potpourri: Potpourri }> => {
  const response = await api.get(`/potpourri/${id}`);
  return response.data;
};

export const getPotpourriMusics = async (id: number, page: number = 1, perPage: number = 100): Promise<ViewPotpourriResponse> => {
  const response = await api.get(`/musicas-potpourri/by-potpourri/${id}`, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const replacePotpourriMusics = async (
  id: number,
  data: UpdatePotpourriRequest
): Promise<UpdatePotpourriResponse> => {
  const response = await api.put(`/potpourri/${id}/replace-musics`, data);
  return response.data;
};
