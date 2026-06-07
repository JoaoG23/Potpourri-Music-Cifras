import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";
import { useAutoScroll } from "../../../hooks/useAutoScroll/useAutoScroll";
import { FloatingViewControls } from "./components/FloatingViewControls";
import { MusicaPotpourriItem } from "../types/potpourriTypes";

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
    queryKey: ["potpourri-musicas-view", id], // Mudei de "potpourri-musicas" para "potpourri-musicas-view"
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse>(
        `/musicas-potpourri/by-potpourri/${id}?page=${pageParam}&per_page=3`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      if (!pagination) return null; // Proteção adicional
      return pagination.has_next ? (pagination.page || 0) + 1 : null;
    },
    enabled: !!id,
  });

  const musicasPotpourri =
    data?.pages?.flatMap((page) => page?.data?.musicas_potpourri || []) || []; // Gera um unico array com todos elementos

  const renderItem = ({ item }: { item: MusicaPotpourriItem }) => (
    <View style={styles.musicaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Title title={item.musica.nome} />
          <Subtitle title={item.musica.artista} />
        </View>
        {item.musica.link_musica && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(item.musica.link_musica!)}
            activeOpacity={0.7}
          >
            <Ionicons name="open-outline" size={16} color="#fff" />
            <Text style={styles.linkText}>Cifra Club</Text>
          </TouchableOpacity>
        )}
      </View>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  linkButton: {
    backgroundColor: "#fc8f36",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 4,
    shadowColor: "#fc8f36",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  linkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
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
