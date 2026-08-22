import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Music, Plus, Trash2, GripVertical, Search, User, Pencil } from "lucide-react";

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

import {
  getMusicList,
  getPotpourriById,
  getPotpourriMusics,
  replacePotpourriMusics,
} from "./api";
import type { Music as MusicType } from "../../../types/music";
import type { MusicaPotpourri } from "../../../types/potpourri";
import { toast } from "sonner";
import { waitTimeAndNavigate } from "@/utils/waitTimeAndNavigate/waitTimeAndNavigate";

export const UpdatePotpourri: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const potpourriId = useMemo(() => Number(id), [id]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [potpourriName, setPotpourriName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedMusics, setSelectedMusics] = useState<MusicaPotpourri[]>([]);
  const [musicCache, setMusicCache] = useState<Record<number, MusicType>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRafRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
      }
    };
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial data: potpourri details
  const {
    data: potpourriData,
    isLoading: isLoadingPotpourri,
    error: potpourriError,
  } = useQuery({
    queryKey: ["potpourri", potpourriId],
    queryFn: () => getPotpourriById(potpourriId),
    enabled: Number.isFinite(potpourriId) && potpourriId > 0,
  });

  // Initial data: potpourri musics
  const {
    data: potpourriMusics,
    error: potpourriMusicsError,
  } = useQuery({
    queryKey: ["potpourri-musics", potpourriId],
    queryFn: () => getPotpourriMusics(potpourriId, 1, 500),
    enabled: Number.isFinite(potpourriId) && potpourriId > 0,
  });

  // Available musics for search
  const shouldSearch = debouncedSearchTerm.length >= 3 || debouncedSearchTerm.length === 0;
  const { data: musicData } = useQuery({
    queryKey: ["musics", debouncedSearchTerm],
    queryFn: () => getMusicList(1, 50, debouncedSearchTerm),
    enabled: shouldSearch,
  });

  // Hydrate name and selected musics when data arrives
  useEffect(() => {
    if (potpourriData?.potpourri) {
      setPotpourriName(potpourriData.potpourri.nome_potpourri);
    }
  }, [potpourriData]);

  useEffect(() => {
    if (potpourriMusics?.musicas_potpourri?.length) {
      // Convert API response with details to our simplified selectedMusics structure
      const items: MusicaPotpourri[] = potpourriMusics.musicas_potpourri
        .sort((a, b) => a.ordem_tocagem - b.ordem_tocagem)
        .map((item) => ({ musica_id: item.musica_id, ordem_tocagem: item.ordem_tocagem }));
      setSelectedMusics(items);

      // Populate music cache with names from response
      const cache: Record<number, MusicType> = {};
      for (const m of potpourriMusics.musicas_potpourri) {
        cache[m.musica_id] = {
          id: m.musica.id,
          nome: m.musica.nome,
          artista: m.musica.artista,
          link_musica: m.musica.link_musica,
          cifra: m.musica.cifra,
          velocidade_rolamento: m.musica.velocidade_rolamento,
          created_at: m.musica.created_at,
          updated_at: m.musica.updated_at,
        };
      }
      setMusicCache((prev) => ({ ...cache, ...prev }));
    }
  }, [potpourriMusics]);

  // Update cache when search results arrive
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

  const initialError = potpourriError || potpourriMusicsError;

  const updateMutation = useMutation({
    mutationFn: (data: { nome_potpourri: string; musicas_potpourri: MusicaPotpourri[] }) =>
      replacePotpourriMusics(potpourriId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potpourri"] });
      queryClient.invalidateQueries({ queryKey: ["potpourri-musics"] });
      toast.success("Potpourri atualizado com sucesso");
      waitTimeAndNavigate(navigate, "/list-potpourris");
    },
  });

  const handleAddMusic = (music: MusicType) => {
    // Avoid duplicates
    if (selectedMusics.some((m) => m.musica_id === music.id)) return;

    const newOrder = selectedMusics.length + 1;
    const newMusicaPotpourri: MusicaPotpourri = {
      musica_id: music.id,
      ordem_tocagem: newOrder,
    };
    setMusicCache((prev) => ({ ...prev, [music.id]: music }));
    setSelectedMusics((prev) => [...prev, newMusicaPotpourri]);
  };

  const handleRemoveMusic = (musicaId: number) => {
    const updatedMusics = selectedMusics
      .filter((m) => m.musica_id !== musicaId)
      .map((m, index) => ({ ...m, ordem_tocagem: index + 1 }));
    setSelectedMusics(updatedMusics);
  };

  const startAutoScroll = (speed: number) => {
    scrollSpeedRef.current = speed;
    if (autoScrollRafRef.current !== null) return;

    const step = () => {
      if (scrollContainerRef.current && scrollSpeedRef.current !== 0) {
        scrollContainerRef.current.scrollTop += scrollSpeedRef.current;
        autoScrollRafRef.current = requestAnimationFrame(step);
      } else {
        autoScrollRafRef.current = null;
      }
    };
    autoScrollRafRef.current = requestAnimationFrame(step);
  };

  const stopAutoScroll = () => {
    scrollSpeedRef.current = 0;
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  };

  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (!scrollContainerRef.current) return;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const threshold = 70; // 70px de sensibilidade no topo e base para rolagem

    if (e.clientY < rect.top + threshold) {
      // Próximo do topo -> sobe
      const intensity = Math.max(0.2, (rect.top + threshold - e.clientY) / threshold);
      startAutoScroll(-Math.round(intensity * 18));
    } else if (e.clientY > rect.bottom - threshold) {
      // Próximo do fundo -> desce
      const intensity = Math.max(0.2, (e.clientY - (rect.bottom - threshold)) / threshold);
      startAutoScroll(Math.round(intensity * 18));
    } else {
      stopAutoScroll();
    }
  };

  const handleContainerDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current?.contains(e.relatedTarget as Node)) {
      stopAutoScroll();
    }
  };

  const handleRowDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    stopAutoScroll();
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedMusics = [...selectedMusics];
    const [movedItem] = updatedMusics.splice(draggedIndex, 1);
    updatedMusics.splice(targetIndex, 0, movedItem);

    const reordered = updatedMusics.map((m, i) => ({
      ...m,
      ordem_tocagem: i + 1,
    }));

    setSelectedMusics(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleContainerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    stopAutoScroll();
    if (draggedIndex === null || !scrollContainerRef.current) return;

    const rect = scrollContainerRef.current.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;
    const targetIndex = e.clientY < midPoint ? 0 : selectedMusics.length - 1;

    handleDrop(targetIndex, e);
  };

  const isMusicSelected = (musicId: number) => selectedMusics.some((m) => m.musica_id === musicId);

  const handleSubmit = () => {
    if (!potpourriName.trim()) {
      alert("Nome do potpourri é obrigatório");
      return;
    }
    if (selectedMusics.length === 0) {
      alert("Selecione pelo menos uma música");
      return;
    }
    updateMutation.mutate({
      nome_potpourri: potpourriName,
      musicas_potpourri: selectedMusics,
    });
  };

 

  const getErrorMessage = (e: unknown): string => {
    if (typeof e === "object" && e !== null && "message" in e) {
      return String((e as { message?: string }).message || "Erro ao carregar dados");
    }
    return "Erro ao carregar dados";
  };

  if (initialError) {
    return <Error message={getErrorMessage(initialError)} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar Potpourri
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
              <p className="text-sm text-gray-500">Digite pelo menos 3 caracteres para iniciar a busca</p>
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
                      <p className="text-gray-500">Digite pelo menos 3 caracteres para buscar músicas</p>
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
                     
                        {isLoadingPotpourri? (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24">
                              <Loading />
                            </TableCell>
                          </TableRow>
                        ) : musicData?.musicas?.map((music) => (
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
                              <Button size="sm" onClick={() => handleAddMusic(music)} disabled={isMusicSelected(music.id)}>
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
                <CardTitle className="text-lg">Músicas Selecionadas ({selectedMusics.length})</CardTitle>
                {selectedMusics.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Arraste os itens para reorganizar a ordem de reprodução
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div
                  ref={scrollContainerRef}
                  onDragOver={handleContainerDragOver}
                  onDragLeave={handleContainerDragLeave}
                  onDrop={handleContainerDrop}
                  className="max-h-96 overflow-y-auto"
                >
                  {selectedMusics.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma música selecionada</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10 text-center"></TableHead>
                          <TableHead className="w-16">Ordem</TableHead>
                          <TableHead>Música</TableHead>
                          <TableHead className="w-16 text-right">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMusics.map((musicaPotpourri, index) => {
                          const music = musicCache[musicaPotpourri.musica_id];
                          const isDragging = draggedIndex === index;
                          const isOver = dragOverIndex === index && draggedIndex !== index;

                          return (
                            <TableRow
                              key={musicaPotpourri.musica_id}
                              draggable
                              onDragStart={(e) => handleDragStart(index, e)}
                              onDragOver={(e) => handleRowDragOver(index, e)}
                              onDragEnd={handleDragEnd}
                              onDrop={(e) => handleDrop(index, e)}
                              className={`cursor-grab active:cursor-grabbing transition-all select-none ${
                                isDragging ? "opacity-30 bg-muted/60" : ""
                              } ${
                                isOver ? "border-t-2 border-primary bg-primary/10" : ""
                              }`}
                            >
                              <TableCell className="text-center px-2 py-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground inline-block" />
                              </TableCell>
                              <TableCell className="py-2">
                                <Badge variant="secondary">{musicaPotpourri.ordem_tocagem}</Badge>
                              </TableCell>
                              <TableCell className="py-2">
                                <div className="flex items-center gap-2">
                                  <Music className="h-4 w-4 text-gray-400 shrink-0" />
                                  <span className="font-medium">{music?.nome}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-2 text-right">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveMusic(musicaPotpourri.musica_id);
                                  }}
                                  title="Remover música"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
            <Button variant="outline" onClick={() => navigate("/list-potpourris")}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={updateMutation.isPending || !potpourriName.trim() || selectedMusics.length === 0}>
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
