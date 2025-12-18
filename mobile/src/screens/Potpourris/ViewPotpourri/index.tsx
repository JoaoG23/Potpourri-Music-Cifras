import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";

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

const FloatingViewControls = ({
  isPlaying,
  onPlayPause,
  speed,
  onSpeedChange,
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
}) => {
  const increaseSpeed = () => {
    if (speed < 5) onSpeedChange(parseFloat((speed + 0.5).toFixed(1)));
  };

  const decreaseSpeed = () => {
    if (speed > 0.5) onSpeedChange(parseFloat((speed - 0.5).toFixed(1)));
  };

  return (
    <View style={styles.controlsPosition}>
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={decreaseSpeed}
          >
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.speedDisplay}>
            <Text style={styles.speedText}>{speed.toFixed(1)}x</Text>
          </View>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={increaseSpeed}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.playButton,
              isPlaying && styles.stopButton,
            ]}
            onPress={onPlayPause}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const ViewPotpourri = () => {
  const route = useRoute<any>();
  const { id, nome } = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);

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

  const stopScrolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startScrolling = useCallback(() => {
    stopScrolling();
    setIsPlaying(true);

    const step = 1;
    const baseInterval = 100;
    const interval = Math.max(16, baseInterval / speed);

    intervalRef.current = setInterval(() => {
      scrollY.current += step;
      flatListRef.current?.scrollToOffset({
        offset: scrollY.current,
        animated: true,
      });
    }, interval);
  }, [speed, stopScrolling]);

  const togglePlay = () => {
    if (isPlaying) {
      stopScrolling();
    } else {
      startScrolling();
    }
  };

  const handleScroll = (event: any) => {
    if (!isPlaying) {
      scrollY.current = event.nativeEvent.contentOffset.y;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startScrolling();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, isPlaying, startScrolling]);

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
  controlsPosition: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  controlsContainer: {
    backgroundColor: "rgba(156, 156, 156, 0.39)",
    padding: 9,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  speedDisplay: {
    width: 50,
    alignItems: "center",
  },
  speedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  playButton: {
    backgroundColor: "#5856d6",
    width: 60,
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#D65D56",
  },
});
