import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";
import { useForm, useWatch } from "react-hook-form";
import api from "../../services/api";
import { Input } from "../../components/Input";

// Tipagem dos dados
interface Musica {
  id: number;
  nome: string;
  artista: string;
}

interface ApiResponse {
  musicas: Musica[];
  pagination: {
    has_next: boolean;
    page: number;
  };
}

export const Musics = () => {
  const { control } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const search = useWatch({
    control,
    name: "search",
  });

  // 1. Busca infinita
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["musicas", search],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = search ? `musicas/search` : `musicas`;
      const params = new URLSearchParams({
        page: pageParam.toString(),
        per_page: "10",
      });

      if (search) params.append("q", search);

      const response = await api.get<ApiResponse>(
        `${endpoint}?${params.toString()}`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_next
        ? lastPage.data.pagination.page + 1
        : null,
  });

  // Achata as páginas em um único array
  const musicas = data?.pages.flatMap((page) => page.data.musicas) || [];

  const color = "#5f5f5fff";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          name="search"
          control={control}
          placeholder="Pesquisar músicas..."
          icon="search"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : isError ? (
        <Text style={styles.center}>Erro ao carregar músicas.</Text>
      ) : (
        <FlatList
          data={musicas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.artista}>{item.artista}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => console.log("Editar", item.id)}
                >
                  <MaterialIcons name="edit" size={20} color={color} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => console.log("Deletar", item.id)}
                >
                  <MaterialIcons name="delete" size={20} color={color} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          // Scroll Infinito
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator color="#000" /> : null
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
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: { flex: 1 },
  nome: { fontSize: 16, fontWeight: "bold" },
  artista: { fontSize: 14, color: "#666" },
  actions: { flexDirection: "row", gap: 15 },
});
