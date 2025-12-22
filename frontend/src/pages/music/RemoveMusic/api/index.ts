import { api } from "../../../../services/endpoint";
import type { Music } from "../../types/Music";

export const deleteMusic = async (id: number): Promise<void> => {
  const response = await api.delete(`/musicas/${id}`);
  return response.data;
};

export const getMusicById = async (id: number): Promise<{ musica: Music }> => {
  const response = await api.get(`/musicas/${id}`);
  return response.data;
};
