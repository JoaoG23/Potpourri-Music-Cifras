import { api } from "../../../../services/endpoint";
import type { MusicsResponse } from "../../../../types/music";

export const getMusicList = async (page: number = 1, perPage: number = 10): Promise<MusicsResponse> => {
  const response = await api.get('/musicas', {
    params: { page, per_page: perPage }
  });
  return response.data;
};
