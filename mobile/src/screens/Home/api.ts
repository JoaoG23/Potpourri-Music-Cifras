import api from "../../services/api";

export interface ArtistasStatsResponse {
  artistas: string[];
  total: number;
}

export const getArtistasStats = async (): Promise<ArtistasStatsResponse> => {
  const response = await api.get<ArtistasStatsResponse>("musicas/artistas");
  return response.data;
};
