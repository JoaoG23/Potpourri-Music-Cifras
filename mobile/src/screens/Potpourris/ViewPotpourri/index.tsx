import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";
import { useAutoScroll } from "../../../hooks/useAutoScroll/useAutoScroll";
import { FloatingViewControls, FloatingMusicTracker } from "./components";
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
  const [indiceMusicaAtiva, setIndiceMusicaAtiva] = useState<number>(0);

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
    queryKey: ["potpourri-musicas-view", id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse>(
        `/musicas-potpourri/by-potpourri/${id}?page=${pageParam}&per_page=10`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      if (!pagination) return null;
      return pagination.has_next ? (pagination.page || 0) + 1 : null;
    },
    enabled: !!id,
  });

  const musicasPotpourri =
    data?.pages?.flatMap((page) => page?.data?.musicas_potpourri || []) || [];

  // Inicializa a velocidade com a primeira música carregada
  useEffect(() => {
    if (musicasPotpourri.length > 0 && indiceMusicaAtiva === 0) {
      const primeiraMusica = musicasPotpourri[0];
      if (primeiraMusica?.musica?.velocidade_rolamento) {
        setSpeed(primeiraMusica.musica.velocidade_rolamento);
      }
    }
  }, [musicasPotpourri.length]);

  // Configuração para detectar qual música está visível na tela
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const primeiroItemVisivel = viewableItems[0];
      if (
        primeiroItemVisivel.index !== null &&
        primeiroItemVisivel.index !== undefined
      ) {
        setIndiceMusicaAtiva(primeiroItemVisivel.index);
      }
    }
  }).current;

  // Navega até uma música específica ao tocar no tracker ou lista
  const navegarParaIndiceMusica = (indiceDestino: number) => {
    if (indiceDestino < 0 || indiceDestino >= musicasPotpourri.length) {
      return;
    }

    setIndiceMusicaAtiva(indiceDestino);

    try {
      flatListRef.current?.scrollToIndex({
        index: indiceDestino,
        animated: true,
        viewPosition: 0,
      });
    } catch {
      // Ignora falha de renderização inicial do índice
    }

    const musicaDestino = musicasPotpourri[indiceDestino];
    if (musicaDestino?.musica?.velocidade_rolamento) {
      setSpeed(musicaDestino.musica.velocidade_rolamento);
    }
  };

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
      {/* Rastreador Flutuante Superior */}
      {musicasPotpourri.length > 0 && (
        <FloatingMusicTracker
          listaMusicasPotpourri={musicasPotpourri}
          indiceMusicaAtual={indiceMusicaAtiva}
          velocidadeAtual={speed}
          aoSelecionarMusica={navegarParaIndiceMusica}
        />
      )}

      <FlatList
        ref={flatListRef}
        data={musicasPotpourri}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0,
            });
          }, 100);
        }}
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

      {/* Controles Flutuantes Inferiores */}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 115 : 85,
    paddingBottom: 110,
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
