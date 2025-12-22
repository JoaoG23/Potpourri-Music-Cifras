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

// Tipos para visualização de potpourri
export interface MusicaPotpourriWithDetails {
  id: number;
  musica_id: number;
  potpourri_id: number;
  ordem_tocagem: number;
  created_at: string;
  updated_at: string;
  musica: {
    id: number;
    nome: string;
    artista: string;
    link_musica: string;
    cifra: string;
    velocidade_rolamento: number;
    created_at: string;
    updated_at: string;
  };
}

export interface ViewPotpourriResponse {
  musicas_potpourri: MusicaPotpourriWithDetails[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_prev: boolean;
  };
  potpourri_id: number;
}
