import React, { useRef, useState, useEffect, useMemo } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../services/api";
import { Title } from "../../../components/Title";
import { Subtitle } from "../../../components/Subtitle";
import { colorirCifras } from "../../../helpers/colorirCifras/colorirCifras";
import { useAutoScroll } from "../../../hooks/useAutoScroll/useAutoScroll";
import { FloatingViewControls, FloatingMusicTracker } from "./components";
import { MusicaPotpourriItem } from "../types/potpourriTypes";
import { TNavigationScreenProps } from "../../../Routes";

interface RespostaApiPotpourri {
  musicas_potpourri: MusicaPotpourriItem[];
  pagination: {
    has_next: boolean;
    has_prev?: boolean;
    page: number;
    pages?: number;
    per_page?: number;
    total?: number;
  };
}

export const ViewPotpourri = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const rotaAtual = useRoute<any>();
  const { id: identificadorPotpourri } = rotaAtual.params || {};

  const referenciaListaFlatList = useRef<FlatList>(null);
  const [indiceMusicaAtiva, setIndiceMusicaAtiva] = useState<number>(0);

  const {
    isPlaying: estaExecutandoRolamento,
    speed: velocidadeRolamentoAtual,
    setSpeed: setVelocidadeRolamentoAtual,
    togglePlay: alternarEstadoRolamento,
    handleScroll: tratarEventoRolamentoManual,
  } = useAutoScroll(referenciaListaFlatList);

  const referenciaVelocidadeAtual = useRef<number>(velocidadeRolamentoAtual);
  referenciaVelocidadeAtual.current = velocidadeRolamentoAtual;

  const {
    data: dadosRequisicaoPotpourri,
    fetchNextPage: buscarProximaPaginaPotpourri,
    hasNextPage: possuiProximaPagina,
    isFetchingNextPage: estaBuscandoProximaPagina,
    isLoading: estaCarregandoDadosIniciais,
    isError: ocorreuErroRequisicao,
  } = useInfiniteQuery({
    queryKey: ["potpourri-musicas-view", identificadorPotpourri],
    queryFn: async ({ pageParam = 1 }) => {
      const respostaRequisicao = await api.get<RespostaApiPotpourri>(
        `/musicas-potpourri/by-potpourri/${identificadorPotpourri}?page=${pageParam}&per_page=4`,
      );
      return respostaRequisicao;
    },
    initialPageParam: 1,
    getNextPageParam: (ultimaPaginaCarregada) => {
      const informacoesPaginacao = ultimaPaginaCarregada?.data?.pagination;
      if (!informacoesPaginacao) return null;
      return informacoesPaginacao.has_next
        ? (informacoesPaginacao.page || 0) + 1
        : null;
    },
    enabled: !!identificadorPotpourri,
  });

  // Lista memoizada de músicas do potpourri carregadas até o momento
  const listaMusicasPotpourri = useMemo(() => {
    return (
      dadosRequisicaoPotpourri?.pages?.flatMap(
        (pagina) => pagina?.data?.musicas_potpourri || [],
      ) || []
    );
  }, [dadosRequisicaoPotpourri]);

  // Total geral de músicas do potpourri vindo da paginação da API (ex: 84)
  const totalGeralMusicasPotpourri = useMemo(() => {
    const totalVindoDaPaginacao =
      dadosRequisicaoPotpourri?.pages?.[0]?.data?.pagination?.total;
    return totalVindoDaPaginacao && totalVindoDaPaginacao > 0
      ? totalVindoDaPaginacao
      : listaMusicasPotpourri.length;
  }, [dadosRequisicaoPotpourri, listaMusicasPotpourri.length]);

  // Atualiza a velocidade de rolamento apenas se houver diferença real na velocidade configurada da nova música ativa
  useEffect(() => {
    if (
      listaMusicasPotpourri.length > 0 &&
      listaMusicasPotpourri[indiceMusicaAtiva]
    ) {
      const musicaAtual = listaMusicasPotpourri[indiceMusicaAtiva];
      const velocidadeConfiguradaMusica =
        musicaAtual?.musica?.velocidade_rolamento ?? 1.0;
      const velocidadeNumericaEfetiva =
        Number(velocidadeConfiguradaMusica) || 1.0;

      if (
        Math.abs(
          referenciaVelocidadeAtual.current - velocidadeNumericaEfetiva,
        ) > 0.01
      ) {
        setVelocidadeRolamentoAtual(velocidadeNumericaEfetiva);
      }
    }
  }, [indiceMusicaAtiva, listaMusicasPotpourri, setVelocidadeRolamentoAtual]);

  // Configuração para detectar qual música está mais visível na tela
  const configuracaoVisibilidadeItens = useRef({
    itemVisiblePercentThreshold: 35,
  }).current;

  const aoMudarItensVisiveisNaLista = useRef(({ viewableItems }: any) => {
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

  // Navega até uma música específica ao tocar no tracker ou na lista
  const navegarParaIndiceMusica = (indiceDestino: number) => {
    if (indiceDestino < 0 || indiceDestino >= listaMusicasPotpourri.length) {
      return;
    }

    setIndiceMusicaAtiva(indiceDestino);

    const musicaDestino = listaMusicasPotpourri[indiceDestino];
    const velocidadeMusicaDestino =
      musicaDestino?.musica?.velocidade_rolamento ?? 1.0;
    const velocidadeNumerica = Number(velocidadeMusicaDestino) || 1.0;

    setVelocidadeRolamentoAtual(velocidadeNumerica);

    try {
      referenciaListaFlatList.current?.scrollToIndex({
        index: indiceDestino,
        animated: true,
        viewPosition: 0,
      });
    } catch {
      // Ignora falha inicial de layout caso o item ainda não tenha sido medido
    }
  };

  const renderizarItemMusica = ({ item }: { item: MusicaPotpourriItem }) => (
    <View style={styles.musicaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Title title={item.musica.nome} />
          <Subtitle title={item.musica.artista} />
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditMusic", { id: item.musica.id })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          {item.musica.link_musica && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(item.musica.link_musica!)}
              activeOpacity={0.7}
            >
              <Ionicons name="open-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>Cifra Club</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.cifraContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>{colorirCifras(item.musica.cifra)}</View>
        </ScrollView>
      </View>
      <View style={styles.separator} />
    </View>
  );

  if (estaCarregandoDadosIniciais) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  if (ocorreuErroRequisicao) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar as músicas do potpourri.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Rastreador Flutuante Superior */}
      {listaMusicasPotpourri.length > 0 && (
        <FloatingMusicTracker
          listaMusicasPotpourri={listaMusicasPotpourri}
          indiceMusicaAtual={indiceMusicaAtiva}
          velocidadeAtual={velocidadeRolamentoAtual}
          totalMusicasGeral={totalGeralMusicasPotpourri}
          estaExecutandoRolamento={estaExecutandoRolamento}
          aoSelecionarMusica={navegarParaIndiceMusica}
        />
      )}

      <FlatList
        ref={referenciaListaFlatList}
        data={listaMusicasPotpourri}
        renderItem={renderizarItemMusica}
        keyExtractor={(item) => item.id.toString()}
        onScroll={tratarEventoRolamentoManual}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={configuracaoVisibilidadeItens}
        onViewableItemsChanged={aoMudarItensVisiveisNaLista}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            referenciaListaFlatList.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0,
            });
          }, 100);
        }}
        onEndReached={() =>
          possuiProximaPagina && buscarProximaPaginaPotpourri()
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          estaBuscandoProximaPagina ? (
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
        isPlaying={estaExecutandoRolamento}
        onPlayPause={alternarEstadoRolamento}
        speed={velocidadeRolamentoAtual}
        onSpeedChange={setVelocidadeRolamentoAtual}
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#5856D6",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#5856D6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  linkButton: {
    backgroundColor: "#fc8f36",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#fc8f36",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
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
