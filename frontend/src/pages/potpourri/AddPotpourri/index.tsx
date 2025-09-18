import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Music, Plus, Trash2, ArrowUp, ArrowDown, Search, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Loading } from "../../../components/custom/Loading";
import { Error } from "../../../components/custom/Error";

import { getMusicList, createPotpourriWithMusics } from "./api";
import type { Music as MusicType } from "../../../types/music";
import type { MusicaPotpourri } from "../../../types/potpourri";

export const AddPotpourri: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [potpourriName, setPotpourriName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedMusics, setSelectedMusics] = useState<MusicaPotpourri[]>([]);
  // Cache local para manter os detalhes das músicas por ID,
  // evitando que o nome/artista desapareçam quando o resultado da busca muda
  const [musicCache, setMusicCache] = useState<Record<number, MusicType>>({});

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Buscar músicas disponíveis - só busca a partir de 3 caracteres
  const shouldSearch = debouncedSearchTerm.length >= 3 || debouncedSearchTerm.length === 0;
  const { data: musicData, isLoading: isLoadingMusics, error: musicError } = useQuery({
    queryKey: ["musics", debouncedSearchTerm],
    queryFn: () => getMusicList(1, 50, debouncedSearchTerm),
    enabled: shouldSearch, // Só executa a query se tiver 3+ caracteres ou estiver vazio
  });

  // Sempre que novos resultados de músicas chegarem, atualiza o cache local
  useEffect(() => {
    if (musicData?.musicas?.length) {
      setMusicCache((prev) => {
        const updated = { ...prev };
        for (const m of musicData.musicas) {
          updated[m.id] = m;
        }
        return updated;
      });
    }
  }, [musicData]);

  // Mutation para criar potpourri
  const createPotpourriMutation = useMutation({
    mutationFn: createPotpourriWithMusics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potpourris"] });
      navigate("/list-potpourris");
    },
  });

  const handleAddMusic = (music: MusicType) => {
    const newOrder = selectedMusics.length + 1;
    const newMusicaPotpourri: MusicaPotpourri = {
      musica_id: music.id,
      ordem_tocagem: newOrder,
    };
    
    // Garante que os detalhes da música fiquem em cache
    setMusicCache((prev) => ({ ...prev, [music.id]: music }));
    setSelectedMusics([...selectedMusics, newMusicaPotpourri]);
  };

  const handleRemoveMusic = (musicaId: number) => {
    const updatedMusics = selectedMusics
      .filter(m => m.musica_id !== musicaId)
      .map((m, index) => ({ ...m, ordem_tocagem: index + 1 }));
    
    setSelectedMusics(updatedMusics);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newMusics = [...selectedMusics];
    [newMusics[index - 1], newMusics[index]] = [newMusics[index], newMusics[index - 1]];
    
    const reorderedMusics = newMusics.map((m, i) => ({ ...m, ordem_tocagem: i + 1 }));
    setSelectedMusics(reorderedMusics);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedMusics.length - 1) return;
    
    const newMusics = [...selectedMusics];
    [newMusics[index], newMusics[index + 1]] = [newMusics[index + 1], newMusics[index]];
    
    const reorderedMusics = newMusics.map((m, i) => ({ ...m, ordem_tocagem: i + 1 }));
    setSelectedMusics(reorderedMusics);
  };

  const handleSubmit = () => {
    if (!potpourriName.trim()) {
      alert("Nome do potpourri é obrigatório");
      return;
    }
    
    if (selectedMusics.length === 0) {
      alert("Selecione pelo menos uma música");
      return;
    }

    createPotpourriMutation.mutate({
      nome_potpourri: potpourriName,
      musicas_potpourri: selectedMusics,
    });
  };

  const isMusicSelected = (musicId: number) => {
    return selectedMusics.some(m => m.musica_id === musicId);
  };

  if (isLoadingMusics) {
    return <Loading />;
  }

  if (musicError) {
    return <Error message={musicError?.message || ""} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Potpourri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome do Potpourri */}
          <div className="space-y-2">
            <Label htmlFor="potpourri-name">Nome do Potpourri</Label>
            <Input
              id="potpourri-name"
              value={potpourriName}
              onChange={(e) => setPotpourriName(e.target.value)}
              placeholder="Digite o nome do potpourri"
            />
          </div>

          {/* Busca de Músicas */}
          <div className="space-y-2">
            <Label htmlFor="search-music">Buscar Músicas</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-music"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite pelo menos 3 caracteres para buscar..."
                className="pl-10"
              />
            </div>
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <p className="text-sm text-gray-500">
                Digite pelo menos 3 caracteres para iniciar a busca
              </p>
            )}
            {shouldSearch && debouncedSearchTerm.length > 0 && (
              <p className="text-sm text-gray-600">
                Pesquisando por: <span className="font-medium">"{debouncedSearchTerm}"</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Músicas Disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Músicas Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {!shouldSearch && searchTerm.length > 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Digite pelo menos 3 caracteres para buscar músicas
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Música</TableHead>
                          <TableHead>Artista</TableHead>
                          <TableHead>Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {musicData?.musicas?.map((music) => (
                          <TableRow key={music.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Music className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{music.nome}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                {music.artista}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleAddMusic(music)}
                                disabled={isMusicSelected(music.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Músicas Selecionadas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Músicas Selecionadas ({selectedMusics.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {selectedMusics.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma música selecionada
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ordem</TableHead>
                          <TableHead>Música</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMusics.map((musicaPotpourri, index) => {
                          // Busca primeiro no cache, com fallback nos dados carregados atualmente
                          const music = musicCache[musicaPotpourri.musica_id] ||
                                        musicData?.musicas?.find(m => m.id === musicaPotpourri.musica_id);
                          return (
                            <TableRow key={musicaPotpourri.musica_id}>
                              <TableCell>
                                <Badge variant="secondary">
                                  {musicaPotpourri.ordem_tocagem}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Music className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">{music?.nome}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === selectedMusics.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveMusic(musicaPotpourri.musica_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/list-potpourris")}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createPotpourriMutation.isPending || !potpourriName.trim() || selectedMusics.length === 0}
            >
              {createPotpourriMutation.isPending ? "Criando..." : "Criar Potpourri"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
