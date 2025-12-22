import { api } from "../../../../services/endpoint";
import type { Music } from "../../../../types/music";

export const getMusicById = async (id: number): Promise<Music> => {
  const response = await api.get(`/musicas/${id}`);
  return response.data;
};

export const updateMusic = async (id: number, data: Partial<Music>): Promise<Music> => {
  const response = await api.put(`/musicas/${id}`, data);
  return response.data;
};