import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DraggableFlatList from "react-native-draggable-flatlist";
import Toast from "react-native-toast-message";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button";
import { AvailableMusicItem } from "../AddPotpourri/components/AvailableMusicItem";
import { PlaylistItem } from "../AddPotpourri/components/PlaylistItem";
import { Musica } from "../../Musics/types/musicasTypes";
import { TNavigationScreenProps } from "../../../Routes";

interface PotpourriForm {
  nome_potpourri: string;
  search: string;
}

interface MusicaPotpourriItem {
  id: number;
  musica: Musica;
  ordem_tocagem: number;
}

export const EditPotpourri = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const route = useRoute<any>();
  const { id } = route.params || {};
  const queryClient = useQueryClient();
  const [playlist, setPlaylist] = useState<Musica[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { control, handleSubmit, watch, setValue } = useForm<PotpourriForm>({
    defaultValues: {
      nome_potpourri: "",
      search: "",
    },
  });

  const searchWatch = watch("search");

  // Fetch Potpourri Details (Name)
  const { data: potpourriData, isLoading: isLoadingPotpourri } = useQuery({
    queryKey: ["potpourri", id],
    queryFn: async () => {
      const response = await api.get(`/potpourri/${id}`);
      return response?.data?.potpourri;
    },
    enabled: !!id,
  });

  // Fetch Potpourri Musics (Playlist)
  const { data: musicasData, isLoading: isLoadingMusicas } = useQuery({
    queryKey: ["potpourri-musicas", id],
    queryFn: async () => {
      // Pedimos uma quantidade alta para garantir que pegamos todas as músicas do potpourri para edição
      const response = await api.get(
        `/musicas-potpourri/by-potpourri/${id}?page=1&per_page=100`
      );
      return (response?.data?.musicas_potpourri || []) as MusicaPotpourriItem[];
    },
    enabled: !!id,
  });

  // Initialize form and playlist state
  useEffect(() => {
    if (potpourriData) {
      setValue("nome_potpourri", potpourriData.nome_potpourri);
    }
    if (musicasData && Array.isArray(musicasData)) {
      const sortedMusicas = [...musicasData]
        .sort((a, b) => a.ordem_tocagem - b.ordem_tocagem)
        .map((item) => item.musica);
      setPlaylist(sortedMusicas);
    }
  }, [potpourriData, musicasData, setValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWatch);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchWatch]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["musicas-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const response = await api.get(
        `/musicas/search?q=${debouncedSearch}&per_page=10`
      );
      return (response?.data?.musicas || []) as Musica[];
    },
    enabled: debouncedSearch.length > 1,
  });

  const { mutate: updatePotpourri, isPending: isSaving } = useMutation({
    mutationFn: async (payload: {
      nome_potpourri: string;
      musicas_potpourri: any[];
    }) => {
      return await api.put(`/potpourri/${id}/replace-musics`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potpourris"] });
      queryClient.invalidateQueries({ queryKey: ["potpourri", id] });
      queryClient.invalidateQueries({ queryKey: ["potpourri-musicas", id] });
      queryClient.invalidateQueries({
        queryKey: ["potpourri-musicas-view", id],
      });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Potpourri atualizado com sucesso!",
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2:
          error?.response?.data?.message || "Erro ao atualizar o potpourri",
      });
    },
  });

  const addToPlaylist = useCallback((music: Musica) => {
    setPlaylist((prev) => {
      if (prev.find((m) => m.id === music.id)) return prev;
      return [...prev, music];
    });
  }, []);

  const removeFromPlaylist = useCallback((id: number) => {
    setPlaylist((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const onSubmit = (data: PotpourriForm) => {
    if (playlist?.length === 0) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Adicione pelo menos uma música à playlist.",
      });
      return;
    }

    const payload = {
      nome_potpourri: data.nome_potpourri,
      musicas_potpourri: playlist?.map((m, index) => ({
        musica_id: m.id,
        ordem_tocagem: index + 1,
      })),
    };
    updatePotpourri(payload);
  };

  if (isLoadingPotpourri || isLoadingMusicas) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Title title="Editar Potpourri" />
        <Input
          name="nome_potpourri"
          control={control}
          placeholder="Nome do Potpourri"
          required="O nome é obrigatório"
        />

        <View style={styles.searchSection}>
          <Subtitle title="Músicas Disponíveis" />
          <Input
            name="search"
            control={control}
            placeholder="Pesquisar músicas para adicionar..."
            icon="search"
          />
        </View>
      </View>

      <View style={styles.listsContainer}>
        {/* Lista de Resultados de Busca */}
        <View style={styles.availableSection}>
          {isSearching ? (
            <ActivityIndicator
              size="small"
              color="#5856D6"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={searchResults || []}
              keyExtractor={(item) => `search-${item.id}`}
              renderItem={({ item }) => (
                <AvailableMusicItem
                  item={item}
                  onAdd={addToPlaylist}
                  isAdded={playlist.some((m) => m.id === item.id)}
                />
              )}
              ListEmptyComponent={
                debouncedSearch ? (
                  <Text style={styles.emptyText}>
                    Nenhuma música encontrada.
                  </Text>
                ) : (
                  <Text style={styles.emptyText}>
                    Pesquise para adicionar músicas.
                  </Text>
                )
              }
              contentContainerStyle={styles.flatListContent}
            />
          )}
        </View>

        {/* Lista da Playlist (Draggable) */}
        <View style={styles.playlistSection}>
          <Subtitle title={`Playlist (${playlist.length})`} />
          <DraggableFlatList
            data={playlist}
            onDragEnd={({ data }) => setPlaylist(data)}
            keyExtractor={(item) => `playlist-${item.id}`}
            renderItem={(props) => (
              <PlaylistItem {...props} onRemove={removeFromPlaylist} />
            )}
            containerStyle={{ flex: 1 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Playlist vazia.</Text>
            }
          />
        </View>
      </View>

      <View style={styles.footer}>
        {isSaving ? (
          <ActivityIndicator size="large" color="#56D688" />
        ) : (
          <Button title="Salvar Alterações" onPress={handleSubmit(onSubmit)} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    paddingBottom: 0,
  },
  searchSection: {
    marginTop: 15,
  },
  listsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  availableSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  playlistSection: {
    flex: 1.2,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    marginTop: 20,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    marginBottom: 40,
    borderTopColor: "#eee",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
