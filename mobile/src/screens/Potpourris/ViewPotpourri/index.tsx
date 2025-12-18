import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";
import { useAutoScroll } from "../../../hooks/useAutoScroll/useAutoScroll";
import { FloatingViewControls } from "./components/FloatingViewControls";

interface Musica {
  id: number;
  nome: string;
  artista: string;
  cifra: string;
  velocidade_rolamento: number;
}

interface MusicaPotpourriItem {
  id: number;
  musica: Musica;
  ordem_tocagem: number;
}

interface ApiResponse {
  musicas_potpourri: MusicaPotpourriItem[];
  pagination: {
    has_next: boolean;
    page: number;
  };
}

export const ViewPotpourri = () => {
  const route = useRoute<any>();
  const { id } = route.params || {};

  const flatListRef = useRef<FlatList>(null);
  const { isPlaying, speed, setSpeed, togglePlay, handleScroll } =
    useAutoScroll(flatListRef);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["potpourri-musicas", id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse>(
        `/musicas-potpourri/by-potpourri/${id}?page=${pageParam}&per_page=2`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_next
        ? lastPage.data.pagination.page + 1
        : null,
    enabled: !!id,
  });

  const musicasPotpourri =
    data?.pages.flatMap((page) => page.data.musicas_potpourri) || [];

  const renderItem = ({ item }: { item: MusicaPotpourriItem }) => (
    <View style={styles.musicaContainer}>
      <Title title={item.musica.nome} />
      <Subtitle title={item.musica.artista} />
      <View style={styles.cifraContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>{colorirCifras(item.musica.cifra)}</View>
        </ScrollView>
      </View>
      <View style={styles.separator} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar as músicas do potpourri.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={musicasPotpourri}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color="#5856D6"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <View style={{ height: 100 }} />
          )
        }
      />

      <FloatingViewControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  musicaContainer: {
    marginBottom: 40,
  },
  cifraContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 40,
    width: "100%",
  },
});
