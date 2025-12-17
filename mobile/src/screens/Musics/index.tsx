import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../../services/api";

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
  // 1. Busca infinita
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["musicas"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse>(
        `musicas/?page=${pageParam}&per_page=10`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_next
        ? lastPage.data.pagination.page + 1
        : null,
  });


  // // 2. Mutação para Deletar
  // const deleteMutation = useMutation({
  //   mutationFn: (id: number) =>
  //     axios.delete(`http://localhost:3004/api/musicas/${id}`),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["musicas"] });
  //     alert("Excluído com sucesso!");
  //   },
  // });

  // Achata as páginas em um único array
  const musicas = data?.pages.flatMap((page) => page.data.musicas) || [];

  if (isLoading)
    return <ActivityIndicator style={styles.center} size="large" />;
  if (isError)
    return <Text style={styles.center}>Erro ao carregar músicas.</Text>;

  const color = "#5f5f5fff";
  return (
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
            <TouchableOpacity onPress={() => console.log("Editar", item.id)}>
              <MaterialIcons name="edit" size={20} color={color} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Deletar", item.id)}>
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
  );
};

const styles = StyleSheet.create({
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
