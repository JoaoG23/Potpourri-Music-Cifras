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
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DraggableFlatList from "react-native-draggable-flatlist";
import Toast from "react-native-toast-message";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button";
import { AvailableMusicItem } from "./components/AvailableMusicItem";
import { PlaylistItem } from "./components/PlaylistItem";
import { Musica } from "../../Musics/types/musicasTypes";
import { TNavigationScreenProps } from "../../../Routes";

interface PotpourriForm {
  nome_potpourri: string;
  search: string;
}

export const AddPotpourri = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const queryClient = useQueryClient();
  const [playlist, setPlaylist] = useState<Musica[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { control, handleSubmit, watch, resetField } = useForm<PotpourriForm>({
    defaultValues: {
      nome_potpourri: "",
      search: "",
    },
  });

  const searchWatch = watch("search");

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
      return response.data.musicas as Musica[];
    },
    enabled: debouncedSearch.length > 1,
  });

  const { mutate: createPotpourri, isPending: isSaving } = useMutation({
    mutationFn: async (data: {
      nome_potpourri: string;
      musicas_potpourri: any[];
    }) => {
      return await api.post("/potpourri/create-with-musics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potpourris"] });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Potpourri criado com sucesso!",
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error?.response?.data?.message || "Erro ao criar o potpourri",
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
    if (playlist.length === 0) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Adicione pelo menos uma música à playlist.",
      });
      return;
    }

    const payload = {
      nome_potpourri: data.nome_potpourri,
      musicas_potpourri: playlist.map((m, index) => ({
        musica_id: m.id,
        ordem_tocagem: index + 1,
      })),
    };

    createPotpourri(payload);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Title title="Novo Potpourri" />
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
          <Button title="Criar Potpourri" onPress={handleSubmit(onSubmit)} />
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
});
