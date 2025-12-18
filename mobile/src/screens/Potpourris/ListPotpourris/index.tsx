import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import api from "../../../services/api";

import { Input } from "../../../components/Input/Input";
import { PotpourriItem } from "../PotpourriItem";

import { Potpourri } from "../types/potpourriTypes";
import { ButtonFloating } from "./components/ButtonFloating";
import { TNavigationScreenProps } from "../../../Routes";

interface ApiResponse {
  potpourri: Potpourri[];
  pagination: {
    has_next: boolean;
    page: number;
  };
}

export const Potpourris = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  const { control } = useForm({
    defaultValues: { search: "" },
  });

  const searchWatch = useWatch({ control, name: "search" });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce da pesquisa para evitar re-renderizações e chamadas de API excessivas
  useEffect(() => {
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
    queryKey: ["potpourris", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = debouncedSearch ? `potpourri/search` : `potpourri`;
      const params = new URLSearchParams({
        page: pageParam.toString(),
        per_page: "15",
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

  const potpourris = data?.pages.flatMap((page) => page.data.potpourri) || [];

  const renderItem = useCallback(
    ({ item }: { item: Potpourri }) => <PotpourriItem item={item} />,
    []
  );

  const keyExtractor = useCallback((item: Potpourri) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      {/* TODO: Navegar para tela de adicionar potpourri quando ela existir */}
      <ButtonFloating onPress={() => navigation.navigate("AddPotpourri")} />
      <View style={styles.header}>
        <Input
          name="search"
          control={control}
          placeholder="Pesquisar potpourris..."
          icon="search"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.center} size="large" color="#5856D6" />
      ) : isError ? (
        <Text style={styles.center}>Erro ao carregar potpourris.</Text>
      ) : (
        <FlatList
          data={potpourris}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(_data, index) => ({
            length: 53, // Ajustado para PotpourriItem que não tem artista
            offset: 53 * index,
            index,
          })}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color="#5856D6"
                style={{ marginVertical: 20 }}
              />
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
