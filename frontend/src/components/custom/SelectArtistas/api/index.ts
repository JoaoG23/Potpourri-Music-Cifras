import { api } from "../../../../services/endpoint";

export interface ArtistasResponse {
  artistas: string[];
  total: number;
}

export const getArtistas = async (): Promise<ArtistasResponse> => {
  const response = await api.get('/musicas/artistas');
  return response.data;
};
