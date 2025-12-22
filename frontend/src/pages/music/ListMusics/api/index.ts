import { api } from "../../../../services/endpoint";
import type { MusicsResponse } from "../../../../types/music";

export const getMusicList = async (page: number = 1, perPage: number = 10): Promise<MusicsResponse> => {
  const response = await api.get('/musicas', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

export const searchMusicList = async (searchTerm: string, page: number = 1, perPage: number = 10): Promise<MusicsResponse> => {
  const response = await api.get('/musicas/search', {
    params: { q: searchTerm, page, per_page: perPage }
  });
  return response.data;
};