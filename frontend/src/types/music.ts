export interface Music {
  id: number;
  nome: string;
  artista: string;
  link_musica: string;
  cifra?: string;
  velocidade_rolamento?: number;
  created_at: string;
  updated_at: string;
}

export interface MusicsResponse {
  musicas: Music[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
