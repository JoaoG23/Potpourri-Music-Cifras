import type { AxiosResponse } from "axios";
import { api } from "../../../../services/endpoint";
import type { MusicsResponse } from "../../../../types/music";
import type { AddMusicRequest } from "../../types/Music";

export const createMusic = async (data: AddMusicRequest): Promise<AxiosResponse<MusicsResponse>> => {
  const response = await api.post('/musicas', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response;
};
