import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import api from "../../../services/api";

import { Input } from "../../../components/Input/Input";
import { MusicItem } from "../MusicItem";

import { Musica } from "../types/musicasTypes";
import { ButtonFloating } from "./components/ButtonFloating";
import { TNavigationScreenProps } from "../../../Routes";

interface ApiResponse {
  musicas: Musica[];
  pagination: {
    has_next: boolean;
    page: number;
  };
}

interface ArtistasResponse {
  artistas: string[];
  total: number;
}

export const Musics = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const [selectedArtista, setSelectedArtista] = useState<string>("");

  const { control } = useForm({
    defaultValues: { search: "" },
  });

  const searchWatch = useWatch({ control, name: "search" });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWatch);
      // Limpa filtro de artista ao pesquisar por texto
      if (searchWatch.length > 0) setSelectedArtista("");
    }, 400);
    return () => clearTimeout(handler);
  }, [searchWatch]);

  // Busca lista de artistas
  const { data: artistasData } = useQuery({
    queryKey: ["artistas"],
    queryFn: async () => {
      const response = await api.get<ArtistasResponse>("musicas/artistas");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["musicas", debouncedSearch, selectedArtista],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        per_page: "15",
      });

      let endpoint = "musicas";
      if (selectedArtista) {
        params.append("artista", selectedArtista);
      } else if (debouncedSearch) {
        endpoint = "musicas/search";
        params.append("q", debouncedSearch);
      }

      const response = await api.get<ApiResponse>(`${endpoint}?${params.toString()}`);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_next
        ? lastPage.data.pagination.page + 1
        : null,
  });

  const musicas = data?.pages.flatMap((page) => page.data.musicas) || [];

  const renderItem = useCallback(
    ({ item }: { item: Musica }) => <MusicItem item={item} />,
    []
  );

  const keyExtractor = useCallback((item: Musica) => item.id.toString(), []);

  const handleSelectArtista = (artista: string) => {
    setSelectedArtista((prev) => (prev === artista ? "" : artista));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ButtonFloating onPress={() => navigation.navigate("AddMusic")} />
      <View style={styles.header}>
        <Input
          name="search"
          control={control}
          placeholder="Pesquisar musicas..."
          icon="search"
        />
      </View>

      {/* Chips de artistas */}
      {artistasData && artistasData.artistas.length > 0 && (
        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <TouchableOpacity
              style={[styles.chip, selectedArtista === "" && styles.chipActive]}
              onPress={() => setSelectedArtista("")}
            >
              <Text style={[styles.chipText, selectedArtista === "" && styles.chipTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            {artistasData.artistas.map((artista) => (
              <TouchableOpacity
                key={artista}
                style={[styles.chip, selectedArtista === artista && styles.chipActive]}
                onPress={() => handleSelectArtista(artista)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedArtista === artista && styles.chipTextActive,
                  ]}
                >
                  {artista}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedArtista !== "" && (
            <Text style={styles.filterInfo}>
              {artistasData.total} artista{artistasData.total !== 1 ? "s" : ""} no sistema
            </Text>
          )}
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : isError ? (
        <Text style={styles.center}>Erro ao carregar musicas.</Text>
      ) : (
        <FlatList
          data={musicas}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(_data, index) => ({
            length: 73,
            offset: 73 * index,
            index,
          })}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 15, paddingBottom: 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  chipsContainer: {
    paddingTop: 10,
  },
  chipsScroll: {
    paddingHorizontal: 15,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#5856D6",
    backgroundColor: "white",
  },
  chipActive: {
    backgroundColor: "#5856D6",
  },
  chipText: {
    fontSize: 13,
    color: "#5856D6",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "white",
  },
  filterInfo: {
    fontSize: 12,
    color: "#888",
    paddingHorizontal: 15,
    paddingTop: 6,
  },
});
