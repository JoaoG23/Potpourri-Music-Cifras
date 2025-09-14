export interface Potpourri {
  id: number;
  nome_potpourri: string;
  created_at: string;
  updated_at: string;
}

export interface PotpourrisResponse {
  potpourri: Potpourri[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Tipos para criação de potpourri
export interface MusicaPotpourri {
  musica_id: number;
  ordem_tocagem: number;
}

export interface CreatePotpourriRequest {
  nome_potpourri: string;
  musicas_potpourri: MusicaPotpourri[];
}

export interface CreatePotpourriResponse {
  message: string;
  data: {
    potpourri: Potpourri;
    musicas_potpourri: MusicaPotpourri[];
  };
}
