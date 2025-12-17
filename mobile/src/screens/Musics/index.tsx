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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useForm, useWatch } from "react-hook-form";
import api from "../../services/api";
import { Input } from "../../components/Input";
import { MusicItem } from "./MusicItem";
import { Musica } from "./types/musicasTypes";

// Tipagem dos dados
interface ApiResponse {
  musicas: Musica[];
  pagination: {
    has_next: boolean;
    page: number;
  };
}

export const Musics = () => {
  const { control } = useForm({
    defaultValues: { search: "" },
  });

  const searchWatch = useWatch({ control, name: "search" });
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce da pesquisa para evitar re-renderizações e chamadas de API excessivas
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWatch);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchWatch]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["musicas", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = debouncedSearch ? `musicas/search` : `musicas`;
      const params = new URLSearchParams({
        page: pageParam.toString(),
        per_page: "15", // Aumentado ligeiramente para preencher melhor a tela
      });

      if (debouncedSearch) params.append("q", debouncedSearch);

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

  const musicas = data?.pages.flatMap((page) => page.data.musicas) || [];

  const renderItem = React.useCallback(
    ({ item }: { item: Musica }) => <MusicItem item={item} />,
    []
  );

  const keyExtractor = React.useCallback(
    (item: Musica) => item.id.toString(),
    []
  );

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
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          // Otimizações de performance
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
});
