import type { Music } from "../../types/Music";

export type MusicDataResponse = {
    musicas?: Music[];
    pagination: {
      page?: number;
      pages?: number;
    };
  };