import { api } from "../../../../services/endpoint";
import type { MusicsResponse } from "../../../../types/music";
import type { CreatePotpourriRequest, CreatePotpourriResponse } from "../../../../types/potpourri";

export const getMusicList = async (page: number = 1, perPage: number = 50, search: string = ""): Promise<MusicsResponse> => {
  const params: any = { page, per_page: perPage };
  if (search) {
    params.search = search;
  }
  
  const response = await api.get('/musicas', { params });
  return response.data;
};

export const createPotpourriWithMusics = async (data: CreatePotpourriRequest): Promise<CreatePotpourriResponse> => {
  const response = await api.post('/potpourri/create-with-musics', data);
  return response.data;
};
