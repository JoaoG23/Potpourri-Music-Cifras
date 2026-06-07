export interface Potpourri {
  id: number;
  nome_potpourri: string;
  created_at?: string;
  updated_at?: string;
}

export interface Musica {
  id: number;
  nome: string;
  artista: string;
  cifra: string;
  velocidade_rolamento: number;
  link_musica?: string;
}

export interface MusicaPotpourriItem {
  id: number;
  musica: Musica;
  ordem_tocagem: number;
}
